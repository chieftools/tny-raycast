import { gql } from "@apollo/client";

export const createLinkMutation = gql`
  mutation raycastLinkCreate($url: URL!) {
    linkCreate(input: { url: $url }) {
      link {
        id
        url
      }
      status {
        success
        errors {
          messages
        }
      }
    }
  }
`;

export const destroyLinkMutation = gql`
  mutation raycastLinkDestroy($id: ID!) {
    linkDestroyById(input: { id: $id }) {
      status {
        success
        errors {
          messages
        }
      }
    }
  }
`;
