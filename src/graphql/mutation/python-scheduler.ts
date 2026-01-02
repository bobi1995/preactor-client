import { gql } from "@apollo/client";

export const RUN_SCHEDULER = gql`
  mutation RunScheduler {
    runScheduler {
      success
      message
      output
    }
  }
`;
