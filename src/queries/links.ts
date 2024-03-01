import { gql } from "@apollo/client";

export default gql`
  query raycastQueryLinks {
    viewer {
      links {
        data {
          url
          updatedAt
          slug
          original
          id
          createdAt
          clicks
        }
      }
    }    
  }
`;