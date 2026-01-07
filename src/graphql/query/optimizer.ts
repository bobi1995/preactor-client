import { gql } from "@apollo/client";

export const GET_OPTIMIZER_DATA = gql`
  query GetOptimizerData {
    getOptimizerSettings {
      id
      strategy
      campaignWindowDays
      gravity
      resourcePriority
      updatedAt
    }
    getOptimizerExecutions {
      id
      startTime
      endTime
      durationSeconds
      status
      strategy
      campaignWindowDays
      gravity
      resourcePriority
      recordCount
      errorMessage
    }
    # We fetch resources to map IDs to Names in the UI
    getResources {
      id
      name
      externalCode
    }
  }
`;
