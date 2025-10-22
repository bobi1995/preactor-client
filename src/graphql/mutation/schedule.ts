import { gql } from "@apollo/client";

export const CREATE_SCHEDULE = gql`
  mutation Mutation($input: CreateWeekScheduleInput!) {
    createSchedule(input: $input) {
      id
    }
  }
`;

export const UPDATE_SCHEDULE = gql`
  mutation Mutation($updateScheduleId: ID!, $input: UpdateWeekScheduleInput!) {
    updateSchedule(id: $updateScheduleId, input: $input) {
      id
    }
  }
`;

export const DELETE_SCHEDULE = gql`
  mutation Mutation($deleteScheduleId: ID!) {
    deleteSchedule(id: $deleteScheduleId) {
      message
      success
    }
  }
`;
