import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query GetGroups {
    groups: getResourceGroups {
      id
      name
      description
      resourceLinks {
        resource {
          id
          name
          description
        }
      }
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation CreateResourceGroup($input: CreateResourceGroupInput!) {
    createResourceGroup(input: $input) {
      id
    }
  }
`;

export const ADD_RESOURCES_TO_GROUP = gql`
  mutation Mutation($resourceIds: [Int!]!, $resourceGroupId: Int!) {
    addResourcesToGroup(
      resourceIds: $resourceIds
      resourceGroupId: $resourceGroupId
    ) {
      id
      name
      description
    }
  }
`;

export const REMOVE_RESOURCE_FROM_GROUP = gql`
  mutation RemoveResourceFromGroup($resourceId: Int!, $resourceGroupId: Int!) {
    removeResourceFromGroup(
      resourceId: $resourceId
      resourceGroupId: $resourceGroupId
    ) {
      message
      success
    }
  }
`;

export const REMOVE_ALL_RESOURCES_FROM_GROUP = gql`
  mutation RemoveAllResourcesFromGroup($resourceGroupId: Int!) {
    removeAllResourcesFromGroup(resourceGroupId: $resourceGroupId) {
      message
      success
    }
  }
`;

export const UPDATE_GROUP = gql`
  mutation Mutation($input: UpdateResourceGroupInput!) {
    updateResourceGroup(input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_GROUP = gql`
  mutation Mutation($deleteResourceGroupId: Int!) {
    deleteResourceGroup(id: $deleteResourceGroupId) {
      message
      success
    }
  }
`;

export const GET_GROUP = gql`
  query GetGroup($id: ID!) {
    group: getGroup(id: $id) {
      id
      name
      description
      resourceLinks {
        resource {
          id
          name
          description
          picture
          color
          externalCode
        }
      }
    }
  }
`;
