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

export const CREATE_ATTR_PARAM = gql`
  mutation CreateAttrParam($input: CreateAttrParamInput!) {
    createAttrParam(input: $input) {
      id
      attributeValue
      attributeNote
    }
  }
`;

export const DELETE_ATTR_PARAM = gql`
  mutation DeleteAttrParam($id: Int!) {
    deleteAttrParam(id: $id) {
      success
      message
    }
  }
`;
