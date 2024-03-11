import { shortenUrl } from "./utils/links";
import { handleGenericError } from "./utils/errors";
import { getSelectedUrlFromClipboard } from "./utils/clipboard";
import { Clipboard, showToast, Toast, showHUD } from "@raycast/api";

export default async function Command() {
  const urlToShorten = await getSelectedUrlFromClipboard();

  if (!urlToShorten) {
    return;
  }

  try {
    const shortUrl = await shortenUrl(urlToShorten);

    if (!shortUrl) {
      return;
    }

    const newUrl: Clipboard.Content = {
      text: shortUrl,
    };

    await Clipboard.copy({
      text: newUrl.text,
    });

    await showToast({
      title: "Created a Tny URL",
      style: Toast.Style.Success,
      message: "Copied the Tny URL to your clipboard!",
    });

    await showHUD("Successfully copied the Tny URL to your clipboard!");
  } catch (error) {
    await handleGenericError(error);
  }
}
