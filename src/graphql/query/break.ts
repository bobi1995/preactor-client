import { gql } from "@apollo/client";

export const DELETE_BREAK = gql`
  mutation DeleteBreak($id: Int!) {
    deleteBreak(id: $id) {
      id
      name
    }
  }
`;

export const REMOVE_BREAK_FROM_SHIFT = gql`
  mutation Mutation($shiftId: ID!, $breakId: ID!) {
    removeBreakFromShift(shiftId: $shiftId, breakId: $breakId) {
      id
    }
  }
`;
