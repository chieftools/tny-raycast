import { gql } from "@apollo/client";

export const listLinksQuery = gql`
  query raycastListLinks($search: String) {
    viewer {
      id
      links(first: 100, search: $search) {
        data {
          id
          url
          clicks
          favicon
          original
          createdAt
        }
      }
    }
  }
`;
