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
      setupTime
      product
      remainingQuan
      priority
      isDirty
      dueDate
      resource {
        id
        name
        color
      }
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

export const GET_ORDERS_BY_RESOURCE = gql`
  query GetOrdersByResource($resourceId: Int!) {
    orders: getOrdersByResource(resourceId: $resourceId) {
      id
      orderNumber
      operationNumber
      startTime
      endTime
      opName
      setupTime
      resource {
        id
        name
        color
      }
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

export const GET_ORDERS_BY_RESOURCE_GROUP = gql`
  query GetOrdersByResourceGroup($resourceGroupId: Int!) {
    orders: getOrdersByResourceGroup(resourceGroupId: $resourceGroupId) {
      id
      orderNumber
      operationNumber
      startTime
      endTime
      opName
      setupTime
      resource {
        id
        name
        color
      }
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
