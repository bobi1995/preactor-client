import { gql } from "@apollo/client";

export const CREATE_RESOURCE_MUTATION = gql`
  mutation Mutation($input: CreateResourceInput!) {
    resource: createResource(input: $input) {
      id
      name
      description
      color
    }
  }
`;

export const UPDATE_RESOURCE_MUTATION = gql`
  mutation Mutation($input: UpdateResourceInput!) {
    updateResource(input: $input) {
      id
      name
      description
      color
      changeoverGroup {
        id
        name
      }
    }
  }
`;

export const DELETE_RESOURCE_MUTATION = gql`
  mutation Mutation($deleteResourceId: Int!) {
    deleteResource(id: $deleteResourceId) {
      message
      success
    }
  }
`;
