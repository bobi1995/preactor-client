import { gql } from "@apollo/client";

export const CREATE_ATTRIBUTE = gql`
  mutation CreateAttribute($name: String!) {
    createAttribute(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_ATTRIBUTE = gql`
  mutation UpdateAttribute($id: ID!, $name: String!) {
    updateAttribute(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_ATTRIBUTE = gql`
  mutation DeleteAttribute($id: ID!) {
    deleteAttribute(id: $id) {
      success
      message
    }
  }
`;
