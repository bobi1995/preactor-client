import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query GetGroups {
    groups: getGroups {
      id
      name
      description
      resources {
        id
        name
        description
      }
    }
  }
`;

export const CREATE_GROUP = gql`
  mutation Mutation($name: String!, $description: String) {
    createGroup(name: $name, description: $description) {
      id
    }
  }
`;

export const ADD_RESOURCES_TO_GROUP = gql`
  mutation Mutation($groupId: ID!, $resourceIds: [ID!]) {
    addResourcesToGroup(groupId: $groupId, resourceIds: $resourceIds)
  }
`;

export const DELETE_RESOURCES_FROM_GROUP = gql`
  mutation Mutation($groupId: ID!, $resourceId: ID!) {
    deleteResourceFromGroup(groupId: $groupId, resourceId: $resourceId)
  }
`;
