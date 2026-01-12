import { gql } from "@apollo/client";

export const GET_OPTIMIZER_DATA = gql`
  query GetOptimizerData {
    getOptimizerSettings {
      id
      campaignWindowDays
      resourcePriority
      maxTime
      updatedAt
    }
    getOptimizerExecutions {
      id
      startTime
      endTime
      durationSeconds
      status
      campaignWindowDays
      maxTime
      resourcePriority
      recordCount
      errorMessage
      strategy
    }
    getResources {
      id
      name
      externalCode
    }
  }
`;
