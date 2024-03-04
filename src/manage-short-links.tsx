import { Action, ActionPanel, Clipboard, Icon, List, showHUD, showToast, Toast } from "@raycast/api";
import Client from "./utils/Client";
import links from "./queries/links";
import { useEffect, useState } from "react";
import linkDelete from "./mutations/linkDelete";
import * as oauth from "./utils/Auth";

export default function Command() {
  const [items, setItems] = useState([]);

  const loadLinks = async (search: string = "") => {
    await Client.query({
      query: links,
      variables: {
        search: search,
      }
    }).then(async (res) => {
      setItems(res.data.viewer.links.data);
    })
  };

  useEffect(() => {
    (async () => {
      try {
        await oauth.authorize();
        loadLinks();
      } catch (error) {
        console.log(error);
      }
    })();
  }, [links]);

  async function deleteLink(id: string) {
    try {
      await Client.mutate({
        mutation: linkDelete,
        variables: {
          id: id,
        }
      });

      await showToast({
        style: Toast.Style.Success,
        title: 'Successfully deleted link'
      });

      await Client.refetchQueries({
        include: "all"
      });

      await loadLinks();
    } catch (error) {
      console.log(error);
      await showToast({
        style: Toast.Style.Failure,
        title: 'Error deleting link'
      });
    }
  }

  async function copyLink(url: string) {
    try {
      await Clipboard.copy(url);

      await showToast({
        style: Toast.Style.Success,
        title: 'Successfully copied url'
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Error copying url'
      });
    }
  }

  async function replaceSelected(url: string) {
    const content: Clipboard.Content = {
      text: url,
    };

    await Clipboard.paste(content);

    showHUD('Replaced with short url');
  }

  return (
    <List filtering={false} isShowingDetail isLoading={items.length === 0} onSearchTextChange={loadLinks} searchBarPlaceholder="Search Tny...">
      {items.map((link: Link, index: number) => (
        <List.Item
          key={index}
          title={link.original}
          icon={{
            source: link.favicon,
          }}
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
                  <List.Item.Detail.Metadata.Label title="Original url" text={link.original} />
                  <List.Item.Detail.Metadata.Label title="Short url" text={link.url} />
                  <List.Item.Detail.Metadata.Label title="Clicks" text={link.clicks.toString()} />
                  <List.Item.Detail.Metadata.Label title="Created" text={link.createdAt} />
                </List.Item.Detail.Metadata>
              }
            />
          }
          actions={
            <ActionPanel title="Manage link">
              <Action title="Copy Short Url"
                      icon={Icon.CopyClipboard}
                      onAction={() => copyLink(link.url)}/>
              <Action title="Copy Original Url"
                      icon={Icon.CopyClipboard}
                      onAction={() => copyLink(link.original)}/>
              <Action title="Replace With Short Url"
                      icon={Icon.Clipboard}
                      onAction={() => replaceSelected(link.url)}/>
              <Action title="Delete"
                      icon={Icon.Trash}
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["ctrl"], key: "x" }}
                      onAction={() => deleteLink(link.id)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

interface Link {
  id: string,
  original: string,
  url: string,
  clicks: number,
  createdAt: string,
  favicon: string,
}