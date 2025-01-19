import { gql } from "@apollo/client";

const DayFragment = gql`
  fragment Day on Shift {
    id
    name
    startHour
    endHour
    breaks {
      id
      startHour
      endHour
      name
    }
  }
`;

export const getResourcesQuery = gql`
  query GetResources {
    resource: getResources {
      id
      description
      picture
      name
      alternateShifts {
        id
        startDate
        endDate
        shift {
          ...Day
        }
      }
      schedule {
        id
        name
        monday {
          ...Day
        }
        tuesday {
          ...Day
        }
        wednesday {
          ...Day
        }
        thursday {
          ...Day
        }
        friday {
          ...Day
        }
        saturday {
          ...Day
        }
        sunday {
          ...Day
        }
      }
    }
  }
  ${DayFragment}
`;

export const getResourceByIdQuery = gql`
  query GetResourceById($id: ID!) {
    resource: getResource(id: $id) {
      id
      name
      description
      color
      picture
      orders {
        id
      }
      schedule {
        id
        name
      }
      alternateShifts {
        id
        startDate
        endDate
        shift {
          name
        }
      }
      restrictions {
        id
      }
    }
  }
`;

export const createResourceMutation = gql`
  mutation Mutation($input: ResourceInput!) {
    resource: createResource(input: $input) {
      id
      name
      description
      color
    }
  }
`;

export const assignSchedule = gql`
  mutation Mutation($resourceId: ID!, $scheduleId: ID!) {
    assignSchedule(resourceId: $resourceId, scheduleId: $scheduleId) {
      id
    }
  }
`;

export const assignAlternativeShiftMutation = gql`
  mutation Mutation(
    $resourceId: ID!
    $shiftId: ID!
    $startDate: String
    $endDate: String
  ) {
    assignAlternativeShiftToResource(
      resourceId: $resourceId
      shiftId: $shiftId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
    }
  }
`;

export const assignMassiveAlternativeShiftMutation = gql`
  mutation Mutation(
    $resourceIds: [ID!]!
    $shiftId: ID!
    $startDate: String
    $endDate: String
  ) {
    assignMassiveAlternative(
      resourceIds: $resourceIds
      shiftId: $shiftId
      startDate: $startDate
      endDate: $endDate
    ) {
      id
    }
  }
`;
