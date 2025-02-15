import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_RESOURCES_TO_GROUP,
  CREATE_GROUP,
  DELETE_RESOURCES_FROM_GROUP,
  GET_GROUPS,
} from "../query/group";

export const useGroups = () => {
  const { loading, error, data, refetch } = useQuery(GET_GROUPS);
  return { loading, error, data, reload: () => refetch() };
};

export const useCreateGroup = () => {
  const [mutate, { loading }] = useMutation(CREATE_GROUP);

  const createGroup = async (name: string, description: string) => {
    const {
      data: { createGroup },
    } = await mutate({
      variables: { name, description },
    });
    return createGroup;
  };
  return { createGroup, loading };
};

export const useAddResourcesToGroup = () => {
  const [mutate, { loading }] = useMutation(ADD_RESOURCES_TO_GROUP);

  const addResourceToGroup = async (groupId: string, resourceIds: string[]) => {
    const {
      data: { addResourceToGroup },
    } = await mutate({
      variables: { groupId, resourceIds },
    });
    return addResourceToGroup;
  };
  return { addResourceToGroup, loading };
};

export const useDeleteResourceFromGroup = () => {
  const [mutate, { loading }] = useMutation(DELETE_RESOURCES_FROM_GROUP);
  const deleteResourceFromGroup = async (
    groupId: string,
    resourceId: string
  ) => {
    const {
      data: { deleteResourceFromGroup },
    } = await mutate({
      variables: { groupId, resourceId },
    });
    return deleteResourceFromGroup;
  };
  return { deleteResourceFromGroup, loading };
};
