import { gql } from "@apollo/client";

export const UPDATE_OPTIMIZER_SETTINGS = gql`
  mutation UpdateOptimizerSettings($input: UpdateOptimizerSettingInput!) {
    updateOptimizerSettings(input: $input) {
      id
      strategy
      campaignWindowDays
      gravity
      resourcePriority
    }
  }
`;

export const RUN_OPTIMIZER = gql`
  mutation RunOptimizer($input: RunOptimizerInput) {
    runOptimizer(input: $input) {
      success
      message
    }
  }
`;
