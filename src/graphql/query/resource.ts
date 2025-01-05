import { gql } from "@apollo/client";

export const getResourcesQuery = gql`
  query GetResources {
    resource: getResources {
      id
      description
      picture
      name
      regularShift {
        id
        name
        startHour
        endHour
        breaks {
          id
          startHour
          endHour
        }
      }
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
      }
      regularShift {
        id
        name
        startHour
        endHour
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

export const assignShiftToResourceMutation = gql`
  mutation Mutation($resourceId: ID!, $shiftId: ID!) {
    assignShiftToResource(resourceId: $resourceId, shiftId: $shiftId) {
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
