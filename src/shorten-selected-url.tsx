import { Clipboard, showToast, Toast, getSelectedText, showHUD } from "@raycast/api";
import Client from "./utils/Client";
import linkCreate from "./mutations/linkCreate";
import * as oauth from "./utils/Auth";

export default async function Command() {
  await oauth.authorize();

  let url: string = '';
  let selectedText: string|null = null;

  try {
    selectedText = await getSelectedText();

    url = selectedText;
  } catch (error) {
    const clipboardText = await Clipboard.read();

    if (clipboardText) {
      url = clipboardText.text;
    }

    if (! clipboardText) {
      await showToast({
        title: 'No url',
        message: 'Please provide a valid url',
        style: Toast.Style.Failure,
      });

      return;
    }
  }

  await Client.mutate({
    mutation: linkCreate,
    variables: {
      url: url
    }
  }).then(async (res) => {
    const shortUrl = res.data.linkCreate.link.url;

    await showToast({
      title: 'Shortened url',
      message: 'Copied the shortened url to your clipboard',
      style: Toast.Style.Success
    });

    const newUrl: Clipboard.Content = {
      text: shortUrl,
    };

    await Clipboard.copy({
      text: newUrl.text,
    });

    showHUD('Successfully copied the shortened url');
  }).catch(async () => {
    await showToast({
      title: 'Error',
      message: 'Could not shorten given url',
      style: Toast.Style.Failure,
    });
  });
}