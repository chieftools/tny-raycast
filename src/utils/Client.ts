import { ApolloClient, createHttpLink, DefaultOptions, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";
import { setContext } from "@apollo/client/link/context";
import * as oauth from "./Auth";

const httpLink = createHttpLink({
  uri: 'https://tny.app/api/graphql',
  fetch: fetch
});

const authLink = setContext(async (_, { headers }) => {
  const token = await oauth.getAccessToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
}

const Client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

export default Client;