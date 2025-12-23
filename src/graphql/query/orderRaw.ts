import { gql } from "@apollo/client";

export const GET_RAW_ORDERS = gql`
  query GetRawOrders {
    getRawOrders {
      id
      orderNo
      partNo
      product
      quantity
      dueDate
      opNo
      operationName
      attributes {
        id
        value
        attribute {
          id
          name
          isParam
        }
        attributeParam {
          id
          attributeValue
        }
      }
    }
  }
`;
