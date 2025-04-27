import { gql } from "@apollo/client";

export const LN_ORDERS = gql`
  query getLNOrders {
    orders: getLNOrders {
      OrderNo
      Project
      DueDate
      OpNo
      ResourceGroup
      ResourceGroupName
      Operation
    }
  }
`;
