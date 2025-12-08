import { gql } from "@apollo/client";

export const GET_CHANGEOVER_GROUPS = gql`
  query GetChangeoverGroups {
    getChangeoverGroups {
      id
      name
      changeoverTimes {
        id
        changeoverTime
        attribute {
          name
        }
      }
    }
  }
`;
