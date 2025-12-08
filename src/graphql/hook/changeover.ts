import { useQuery, useMutation } from "@apollo/client";
import { IChangeoverGroup } from "../interfaces";
import { GET_CHANGEOVER_GROUPS } from "../query/changeover";
import {
  DELETE_CHANGEOVER_GROUP,
  CREATE_CHANGEOVER_GROUP,
  UPDATE_CHANGEOVER_GROUP,
  SET_CHANGEOVER_TIME,
  DELETE_CHANGEOVER_TIME,
} from "../mutation/changeover";

export const useChangeoverGroups = () => {
  const { data, loading, error, refetch } = useQuery(GET_CHANGEOVER_GROUPS);

  return {
    changeoverGroups: (data?.getChangeoverGroups || []) as IChangeoverGroup[],
    loading,
    error,
    refetch,
  };
};

export const useCreateChangeoverGroup = () => {
  const [createGroup, { loading, error }] = useMutation(
    CREATE_CHANGEOVER_GROUP,
    {
      refetchQueries: [{ query: GET_CHANGEOVER_GROUPS }],
      onError: (err) => console.error("Error creating group:", err),
    }
  );

  const createChangeoverGroup = async (name: string) => {
    const { data } = await createGroup({ variables: { name } });
    return data?.createChangeoverGroup;
  };

  return { createChangeoverGroup, loading, error };
};

export const useUpdateChangeoverGroup = () => {
  const [updateGroup, { loading, error }] = useMutation(
    UPDATE_CHANGEOVER_GROUP,
    {
      refetchQueries: [{ query: GET_CHANGEOVER_GROUPS }],
      onError: (err) => console.error("Error updating group:", err),
    }
  );

  const updateChangeoverGroup = async (id: string | number, name: string) => {
    const { data } = await updateGroup({
      variables: { id: Number(id), name },
    });
    return data?.updateChangeoverGroup;
  };

  return { updateChangeoverGroup, loading, error };
};

export const useDeleteChangeoverGroup = () => {
  const [deleteGroup, { loading, error }] = useMutation(
    DELETE_CHANGEOVER_GROUP,
    {
      refetchQueries: [{ query: GET_CHANGEOVER_GROUPS }],
      onError: (err) => console.error("Error deleting group:", err),
    }
  );

  const deleteChangeoverGroup = async (id: string | number) => {
    const { data } = await deleteGroup({
      variables: { id: Number(id) },
    });
    return data?.deleteChangeoverGroup;
  };

  return { deleteChangeoverGroup, loading, error };
};

export const useSetChangeoverTime = () => {
  const [setTime, { loading, error }] = useMutation(SET_CHANGEOVER_TIME, {
    refetchQueries: [{ query: GET_CHANGEOVER_GROUPS }],
    onError: (err) => console.error("Error setting time:", err),
  });

  const setChangeoverTime = async (
    groupId: number,
    attrId: number,
    time: number
  ) => {
    return await setTime({
      variables: {
        input: {
          changeoverGroupId: groupId,
          attributeId: attrId,
          changeoverTime: time,
        },
      },
    });
  };

  return { setChangeoverTime, loading, error };
};

export const useDeleteChangeoverTime = () => {
  const [deleteTime, { loading, error }] = useMutation(DELETE_CHANGEOVER_TIME, {
    refetchQueries: [{ query: GET_CHANGEOVER_GROUPS }],
    onError: (err) => console.error("Error deleting time:", err),
  });

  const deleteChangeoverTime = async (id: number) => {
    return await deleteTime({
      variables: { id: Number(id) },
    });
  };

  return { deleteChangeoverTime, loading, error };
};
