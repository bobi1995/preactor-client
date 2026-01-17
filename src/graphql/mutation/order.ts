import { gql } from "@apollo/client";

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      id
      priority
      remainingQuan
      dueDate
      isDirty
    }
  }
`;
