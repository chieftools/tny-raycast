import { client } from "../api/client";
import { authorize } from "../api/auth";
import { showToast, Toast } from "@raycast/api";
import { createLinkMutation } from "../api/mutations/links";
import { genericErrorMessage } from "./errors";

export async function shortenUrl(urlToShorten: string): Promise<string | null> {
  await authorize();

  const { data } = await client.mutate({
    mutation: createLinkMutation,
    variables: {
      url: urlToShorten,
    },
  });

  const response = data.linkCreate;

  if (!response.status.success) {
    await showToast({
      title: "Error",
      style: Toast.Style.Failure,
      message: response.status.errors[0].messages[0] ?? genericErrorMessage,
    });

    return null;
  }

  return response.link.url;
}
