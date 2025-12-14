import { gql } from "@apollo/client";

export const GET_CHANGEOVER_GROUPS = gql`
  query GetChangeoverGroups {
    getChangeoverGroups {
      id
      name
      changeoverTimes {
        id
        changeoverTime
        attributeId
        attribute {
          id
          name
        }
      }
    }
  }
`;

export const GET_MATRIX_CONFIGURATION = gql`
  query GetMatrixConfiguration($groupId: Int!, $attrId: Int!) {
    getChangeoverDataMatrix(changeoverGroupId: $groupId) {
      id
      setupTime
      fromAttrParamId
      toAttrParamId
      fromAttributeParameter {
        attributeValue
      }
      toAttributeParameter {
        attributeValue
      }
    }
    getAttribute(id: $attrId) {
      id
      name
      attributeParameters {
        id
        attributeValue
      }
    }
  }
`;
