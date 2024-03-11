import { showToast, Toast } from "@raycast/api";

export const genericErrorMessage = "An error occurred! Please try again.";

export async function handleGenericError(error: unknown) {
  console.error(error);

  await showToast({
    title: "Error",
    style: Toast.Style.Failure,
    message: genericErrorMessage,
  });
}
