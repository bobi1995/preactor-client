import { gql } from "@apollo/client";

export const CREATE_ATTRIBUTE = gql`
  mutation CreateAttribute($input: CreateAttributeInput!) {
    createAttribute(input: $input) {
      id
      name
      isParam
    }
  }
`;

export const UPDATE_ATTRIBUTE = gql`
  mutation UpdateAttribute($id: Int!, $input: UpdateAttributeInput!) {
    updateAttribute(id: $id, input: $input) {
      id
      name
      isParam
    }
  }
`;

export const DELETE_ATTRIBUTE = gql`
  mutation DeleteAttribute($deleteAttributeId: ID!) {
    deleteAttribute(id: $deleteAttributeId) {
      message
      success
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
