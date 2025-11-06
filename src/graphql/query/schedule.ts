import { gql } from "@apollo/client";

const DayFragment = gql`
  fragment DayFragment on Shift {
    id
    name
    endHour
    startHour
    breaks {
      id
      startTime
      name
      endTime
    }
  }
`;

export const GET_SCHEDULES = gql`
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
      sunday {
        ...DayFragment
      }
    }
  }
  ${DayFragment}
`;

export const GET_SCHEDULES_MINIMAL = gql`
  query Query {
    schedules: getSchedules {
      id
      name
    }
  }
`;

export const GET_SCHEDULE = gql`
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
      sunday {
        ...DayFragment
      }
    }
  }
  ${DayFragment}
`;
