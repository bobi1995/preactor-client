import { gql } from "@apollo/client";

export const GET_SHIFTS = gql`
  query getShifts {
    shifts: getShifts {
      id
      startHour
      name
      endHour
    }
  }
`;

export const GET_SHIFT = gql`
  query Query($getShiftId: ID!) {
    shift: getShift(id: $getShiftId) {
      id
      name
      startHour
      endHour
      breaks {
        startTime
        endTime
        id
        name
      }
    }
  }
`;
