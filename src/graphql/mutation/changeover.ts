import { gql } from "@apollo/client";

export const CREATE_CHANGEOVER_GROUP = gql`
  mutation CreateChangeoverGroup($name: String!) {
    createChangeoverGroup(name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_CHANGEOVER_GROUP = gql`
  mutation UpdateChangeoverGroup($id: Int!, $name: String!) {
    updateChangeoverGroup(id: $id, name: $name) {
      id
      name
    }
  }
`;

export const DELETE_CHANGEOVER_GROUP = gql`
  mutation DeleteChangeoverGroup($id: Int!) {
    deleteChangeoverGroup(id: $id) {
      success
      message
    }
  }
`;

export const SET_CHANGEOVER_TIME = gql`
  mutation SetChangeoverTime($input: SetChangeoverTimeInput!) {
    setChangeoverTime(input: $input) {
      id
      changeoverTime
    }
  }
`;

export const DELETE_CHANGEOVER_TIME = gql`
  mutation DeleteChangeoverTime($id: Int!) {
    deleteChangeoverTime(id: $id) {
      success
      message
    }
  }
`;

export const SET_CHANGEOVER_DATA = gql`
  mutation SetChangeoverData($input: SetChangeoverDataInput!) {
    setChangeoverData(input: $input) {
      id
      setupTime
    }
  }
`;

export const DELETE_CHANGEOVER_DATA = gql`
  mutation Mutation($deleteChangeoverDataId: Int!) {
    deleteChangeoverData(id: $deleteChangeoverDataId) {
      message
      success
    }
  }
`;
