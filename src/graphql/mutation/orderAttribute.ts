import { gql } from "@apollo/client";

export const ADD_ORDER_ATTRIBUTE = gql`
  mutation AddOrderAttribute($input: AddOrderAttributeInput!) {
    addOrderAttribute(input: $input) {
      id
      value
    }
  }
`;

export const DELETE_ORDER_ATTRIBUTE = gql`
  mutation DeleteOrderAttribute($id: Int!) {
    deleteOrderAttribute(id: $id) {
      success
      message
    }
  }
`;
