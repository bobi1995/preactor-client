import { gql } from "@apollo/client";

export const getShifts = gql`
  query getShifts {
    shifts: getShifts {
      id
      startHour
      name
      endHour
    }
  }
`;

export const getShift = gql`
  query getShift($id: ID!) {
    shift: getShift(id: $id) {
      id
      startHour
      name
      endHour
      breaks {
        id
        name
        startHour
        endHour
      }
      resources {
        id
        name
        picture
        description
      }
    }
  }
`;

export const getBreaks = gql`
  query getBreaks {
    breaks: getBreaks {
      id
      name
      startHour
      endHour
    }
  }
`;

export const createShiftMutation = gql`
  mutation Mutation($input: ShiftInput!) {
    shift: createShift(input: $input) {
      id
    }
  }
`;

export const assignBreakMutation = gql`
  mutation AssignBreakToShift($shiftId: ID!, $breakId: ID!) {
    assignBreakToShift(shiftId: $shiftId, breakId: $breakId) {
      id
    }
  }
`;

export const createBreakMutation = gql`
  mutation Mutation($input: BreakInput!) {
    createBreak(input: $input) {
      id
      name
      startHour
      endHour
    }
  }
`;
