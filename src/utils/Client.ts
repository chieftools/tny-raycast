import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import fetch from "cross-fetch";
import { setContext } from "@apollo/client/link/context";
import { getPreferenceValues } from "@raycast/api";

const httpLink = createHttpLink({
  uri: 'https://tny.app/api/graphql',
  fetch: fetch
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const preferenceValues = getPreferenceValues();
  const token = preferenceValues.personal_access_token;

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const Client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default Client;