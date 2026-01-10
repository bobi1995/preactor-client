import { gql } from "@apollo/client";

export const GET_OPTIMIZATION_SCENARIOS = gql`
  query GetOptimizationScenarios {
    getOptimizationScenarios {
      id
      name
      description
      isDefault # <--- ADD THIS
      latenessWeight
      changeoverWeight
      makespanWeight
      loadRangeWeight
      maxLoadWeight
      gravityWeight
      updatedAt
    }
  }
`;
