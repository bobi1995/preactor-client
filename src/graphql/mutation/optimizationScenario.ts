import { gql } from "@apollo/client";

export const CREATE_OPTIMIZATION_SCENARIO = gql`
  mutation CreateOptimizationScenario(
    $input: CreateOptimizationScenarioInput!
  ) {
    createOptimizationScenario(input: $input) {
      id
      name
      isDefault
    }
  }
`;

export const UPDATE_OPTIMIZATION_SCENARIO = gql`
  mutation UpdateOptimizationScenario(
    $input: UpdateOptimizationScenarioInput!
  ) {
    updateOptimizationScenario(input: $input) {
      id
      name
      isDefault
      latenessWeight
    }
  }
`;
export const DELETE_OPTIMIZATION_SCENARIO = gql`
  mutation DeleteOptimizationScenario($id: Int!) {
    deleteOptimizationScenario(id: $id) {
      success
      message
    }
  }
`;
export const SET_DEFAULT_SCENARIO = gql`
  mutation SetDefaultScenario($id: Int!) {
    setDefaultScenario(id: $id) {
      success
      message
    }
  }
`;
