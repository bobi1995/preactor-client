import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query GetGroups {
    groups: getGroups {
      id
      name
      description
      resources {
        id
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
