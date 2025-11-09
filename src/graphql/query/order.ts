import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      orderNumber
      operationNumber
      startTime
      endTime
      opName
      resource {
        id
        name
        color
      }
    }
  }
`;

export const GET_ORDERS_BY_RESOURCE = gql`
  query GetOrdersByResource($resourceId: Int!) {
    orders: getOrdersByResource(resourceId: $resourceId) {
      id
      orderNumber
      operationNumber
      startTime
      endTime
      opName
      resource {
        id
        name
        color
      }
    }
  }
`;

export const GET_ORDERS_BY_RESOURCE_GROUP = gql`
  query GetOrdersByResourceGroup($resourceGroupId: Int!) {
    orders: getOrdersByResourceGroup(resourceGroupId: $resourceGroupId) {
      id
      orderNumber
      operationNumber
      startTime
      endTime
      opName
      resource {
        id
        name
        color
      }
    }
  }
`;
