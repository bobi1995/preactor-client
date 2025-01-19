import { gql } from "@apollo/client";

const DayFragment = gql`
  fragment DayFragment on Shift {
    id
    name
    endHour
    startHour
    breaks {
      id
      endHour
      name
      startHour
    }
  }
`;

export const getSchedules = gql`
  query Query {
    schedules: getSchedules {
      id
      name
      monday {
        ...DayFragment
      }
      tuesday {
        ...DayFragment
      }
      wednesday {
        ...DayFragment
      }
      thursday {
        ...DayFragment
      }
      friday {
        ...DayFragment
      }
      saturday {
        ...DayFragment
      }
    }
  }
  ${DayFragment}
`;

export const getSchedule = gql`
  query Query($getScheduleId: ID!) {
    schedule: getSchedule(id: $getScheduleId) {
      id
      name
      monday {
        ...DayFragment
      }
      tuesday {
        ...DayFragment
      }
      wednesday {
        ...DayFragment
      }
      thursday {
        ...DayFragment
      }
      friday {
        ...DayFragment
      }
      saturday {
        ...DayFragment
      }
    }
  }
  ${DayFragment}
`;

export const createSchedule = gql`
  mutation Mutation($name: String!) {
    createSchedule(name: $name) {
      id
    }
  }
`;

export const updateSchedule = gql`
  mutation Mutation($updateScheduleId: ID!, $input: WeekScheduleInput!) {
    updateSchedule(id: $updateScheduleId, input: $input) {
      id
    }
  }
`;
