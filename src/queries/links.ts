import { gql } from "@apollo/client";

export default gql`
  query raycastQueryLinks($search: String) {
    viewer {
      links(search: $search) {
        data {
          url
          updatedAt
          slug
          original
          id
          createdAt
          clicks
          favicon
        }
      }
    }    
  }
`;