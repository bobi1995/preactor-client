import { useQuery, useMutation } from "@apollo/client";
import {
  ADD_RESOURCES_TO_GROUP,
  CREATE_GROUP,
  REMOVE_RESOURCE_FROM_GROUP,
  REMOVE_ALL_RESOURCES_FROM_GROUP,
  GET_GROUPS,
  UPDATE_GROUP,
  DELETE_GROUP,
  GET_GROUP,
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
      variables: { input: { name, description } },
      refetchQueries: [{ query: GET_GROUPS }],
    });
    return createGroup;
  };
  return { createGroup, loading };
};

export const useAddResourcesToGroup = () => {
  const [mutate, { loading }] = useMutation(ADD_RESOURCES_TO_GROUP);

  const addResourcesToGroup = async (
    resourceGroupId: string,
    resourceIds: string[]
  ) => {
    const {
      data: { addResourcesToGroup },
    } = await mutate({
      variables: {
        resourceGroupId: parseInt(resourceGroupId),
        resourceIds: resourceIds.map((id) => parseInt(id)),
      },
      refetchQueries: [{ query: GET_GROUPS }],
    });
    return addResourcesToGroup;
  };
  return { addResourcesToGroup, loading };
};

export const useRemoveResourceFromGroup = () => {
  const [mutate, { loading }] = useMutation(REMOVE_RESOURCE_FROM_GROUP);
  const removeResourceFromGroup = async (
    resourceGroupId: string,
    resourceId: string
  ) => {
    const {
      data: { removeResourceFromGroup },
    } = await mutate({
      variables: {
        resourceGroupId: parseInt(resourceGroupId),
        resourceId: parseInt(resourceId),
      },
      refetchQueries: [{ query: GET_GROUPS }],
    });
    return removeResourceFromGroup;
  };
  return { removeResourceFromGroup, loading };
};

export const useRemoveAllResourcesFromGroup = () => {
  const [mutate, { loading }] = useMutation(REMOVE_ALL_RESOURCES_FROM_GROUP);
  const removeAllResourcesFromGroup = async (resourceGroupId: string) => {
    const {
      data: { removeAllResourcesFromGroup },
    } = await mutate({
      variables: {
        resourceGroupId: parseInt(resourceGroupId),
      },
      refetchQueries: [{ query: GET_GROUPS }],
    });
    return removeAllResourcesFromGroup;
  };
  return { removeAllResourcesFromGroup, loading };
};

export const useUpdateGroup = () => {
  const [mutate, { loading }] = useMutation(UPDATE_GROUP);

  const updateGroup = async (
    id: string,
    name: string,
    description?: string
  ) => {
    const {
      data: { updateGroup },
    } = await mutate({
      variables: { input: { id, name, description } },
      refetchQueries: [{ query: GET_GROUPS }],
    });
    return updateGroup;
  };
  return { updateGroup, loading };
};

export const useDeleteGroup = () => {
  const [mutate, { loading }] = useMutation(DELETE_GROUP);

  const deleteGroup = async (id: string) => {
    const {
      data: { deleteGroup },
    } = await mutate({
      variables: { deleteResourceGroupId: parseInt(id) },
      refetchQueries: [{ query: GET_GROUPS }],
    });
    return deleteGroup;
  };
  return { deleteGroup, loading };
};

export const useGroup = (id: string) => {
  const { loading, error, data, refetch } = useQuery(GET_GROUP, {
    variables: { id },
    skip: !id,
  });
  return { loading, error, group: data?.group, reload: () => refetch() };
};
