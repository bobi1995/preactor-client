import { gql } from "@apollo/client";
export const ASSIGN_BREAK_MUTATION = gql`
  mutation AssignBreakToShift($shiftId: ID!, $breakId: ID!) {
    assignBreakToShift(shiftId: $shiftId, breakId: $breakId) {
      id
    }
  }
`;
