import fetch from "cross-fetch";
import { setContext } from "@apollo/client/link/context";
import { environment } from "@raycast/api";
import { getAccessToken } from "./auth";
import { ApolloClient, createHttpLink, DefaultOptions, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://tny.app/api/graphql",
  fetch: fetch,
  headers: {
    "user-agent": `Raycast/${environment.raycastVersion} (extension:${environment.extensionName} dev:${environment.isDevelopment})`,
    "graphql-client": `raycast:${environment.raycastVersion}`,
  },
});

const authLink = setContext(async (_, { headers }) => {
  const token = await getAccessToken();

  return {
    headers: {
      ...headers,
      ...(token
        ? {
            authorization: `Bearer ${token}`,
          }
        : {}),
    },
  };
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "cache-first",
    errorPolicy: "all",
  },
};

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});
