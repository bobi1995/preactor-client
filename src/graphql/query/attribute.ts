import { gql } from "@apollo/client";

export const GET_ATTRIBUTES = gql`
  query GetAttributes {
    getAttributes {
      name
      attributeParameters {
        attributeValue
        id
        attributeId
        attributeNote
      }
      id
      isParam
    }
  }
`;
