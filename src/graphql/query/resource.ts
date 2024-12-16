import { gql } from "@apollo/client";

export const getResourcesQuery = gql`
  query GetResources {
    resource: getResources {
      id
      description
      color
      name
    }
  }
`;

export const getResourceByIdQuery = gql`
  query GetResourceById($id: ID!) {
    resource: getResource(id: $id) {
      id
      name
      description
      color
      picture
      orders {
        id
      }
      regularShift {
        id
      }
      alternateShifts {
        id
      }
      canReplace {
        id
      }
      replacedBy {
        id
      }
      restrictions {
        id
      }
    }
  }
`;

export const createResourceMutation = gql`
  mutation Mutation($input: ResourceInput!) {
    resource: createResource(input: $input) {
      id
      name
      description
      color
    }
  }
`;
