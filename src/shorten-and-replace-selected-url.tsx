import { Clipboard, showToast, Toast, getSelectedText } from "@raycast/api";
import Client from "./utils/Client";
import linkCreate from "./mutations/linkCreate";

export default async function Command() {
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

    await Clipboard.paste(newUrl);
  }).catch(async () => {
    await showToast({
      title: 'Error',
      message: 'Could not shorten given url',
      style: Toast.Style.Failure,
    });
  });
}