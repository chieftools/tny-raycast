import { gql } from "@apollo/client";

export default gql`
  mutation raycastLinkCreate($url: URL!) {
    linkCreate(input: {
      url: $url
    }) {
      link {
        url
      }
      status {
        success
        errors {
          name
          messages
        }
      }
    }
  }
`;