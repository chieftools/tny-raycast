import { Action, ActionPanel, Clipboard, Icon, List, showToast, Toast } from "@raycast/api";
import Client from "./utils/Client";
import links from "./queries/links";
import { useEffect, useState } from "react";
import linkDelete from "./mutations/linkDelete";

export default function Command() {
  const [items, setItems] = useState([]);

  const loadLinks = async () => {
    await Client.query({
      query: links,
    }).then(async (res) => {
      setItems(res.data.viewer.links.data);
    })
  };

  useEffect(() => {
    loadLinks();
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

  return (
    <List isShowingDetail isLoading={items.length === 0}>
      {items.map((link: Link) => (
        <List.Item
          key={link.id}
          title={link.original}
          detail={
            <List.Item.Detail
              metadata={
                <List.Item.Detail.Metadata>
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
}