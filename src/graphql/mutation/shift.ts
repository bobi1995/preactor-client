import { gql } from "@apollo/client";

export const UPDATE_SHIFT = gql`
  mutation UpdateShift($updateShiftId: ID!, $input: ShiftFields!) {
    updateShift(id: $updateShiftId, input: $input) {
      id
    }
  }
`;

export const CREATE_SHIFT = gql`
  mutation CreateShift($input: ShiftFields!) {
    createShift(input: $input) {
      id
    }
  }
`;

export const DELETE_SHIFT_MUTATION = gql`
  mutation Mutation($deleteShiftId: ID!) {
    deleteShift(id: $deleteShiftId) {
      message
      success
    }
  }
`;

export const ERROR_CODE_TO_TRANSLATION_KEY: { [key: string]: string } = {
  SHIFT_IN_USE_BY_RESOURCE: "deleteShiftErrors.inUseByResource",
  SHIFT_IN_USE_BY_SCHEDULE: "deleteShiftErrors.inUseBySchedule",
  SHIFT_IN_USE_BY_ALTERNATIVE: "deleteShiftErrors.inUseByAlternative",
  NOT_FOUND: "deleteShiftErrors.notFound",
  INTERNAL_SERVER_ERROR: "deleteShiftErrors.internal",
};
