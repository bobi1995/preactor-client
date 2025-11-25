import { gql } from "@apollo/client";

const DayFragment = gql`
  fragment Day on Shift {
    startHour
    endHour
    breaks {
      startTime
      endTime
    }
  }
`;

export const getResourcesQuery = gql`
  query GetResources {
    resource: getResources {
      id
      name
      color
      description
      externalCode
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
      picture
    }
  }
  ${DayFragment}
`;

export const getResourcesWithoutGroupQuery = gql`
  query GetResourcesWithoutGroup {
    resources: getResourcesWithoutGroup {
      id
      name
      description
    }
  }
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
        OpNo
        OrderNo
        StartTime
        EndTime
        OperationName
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

export const deleteAlternativeShiftMutation = gql`
  mutation Mutation($id: ID!) {
    deleteAlternativeShift(id: $id) {
      id
    }
  }
`;
