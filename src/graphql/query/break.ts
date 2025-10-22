import { gql } from "@apollo/client";

export const DELETE_BREAK = gql`
  mutation DeleteBreak($id: ID!) {
    deleteBreak(id: $id) {
      success
      message
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

export const GET_BREAKS = gql`
  query getBreaks {
    breaks: getBreaks {
      id
      name
      startTime
      endTime
      shifts {
        id
        name
      }
    }
  }
`;

export const CREATE_BREAK = gql`
  mutation Mutation($input: BreakFields!) {
    createBreak(input: $input) {
      id
      name
      startTime
      endTime
    }
  }
`;

export const UPDATE_BREAK = gql`
  mutation UpdateBreak($id: ID!, $input: BreakFields!) {
    updateBreak(id: $id, input: $input) {
      id
      name
      startTime
      endTime
    }
  }
`;
