import { useQuery, useMutation } from "@apollo/client";
import { IAttribute } from "../interfaces";
import { GET_ATTRIBUTES } from "../query/attribute";
import {
  CREATE_ATTRIBUTE,
  DELETE_ATTRIBUTE,
  UPDATE_ATTRIBUTE,
} from "../mutation/attribute";

export const useAttributes = () => {
  const { data, loading, error, refetch } = useQuery(GET_ATTRIBUTES);

  return {
    attributes: (data?.getAttributes || []) as IAttribute[],
    loading,
    error,
    refetch,
  };
};

export const useCreateAttribute = () => {
  const [createAttributeMutation, { loading, error }] = useMutation(
    CREATE_ATTRIBUTE,
    {
      // Refetch the list after creating to update the UI immediately
      refetchQueries: [{ query: GET_ATTRIBUTES }],
      onError: (err) => {
        console.error("Error creating attribute:", err);
      },
    }
  );

  const createAttribute = async (name: string) => {
    const { data } = await createAttributeMutation({
      variables: { name },
    });
    return data?.createAttribute;
  };

  return { createAttribute, loading, error };
};

export const useUpdateAttribute = () => {
  const [updateAttributeMutation, { loading, error }] = useMutation(
    UPDATE_ATTRIBUTE,
    {
      refetchQueries: [{ query: GET_ATTRIBUTES }],
      onError: (err) => {
        console.error("Error updating attribute:", err);
      },
    }
  );

  const updateAttribute = async (id: string, name: string) => {
    const { data } = await updateAttributeMutation({
      variables: { id, name },
    });
    return data?.updateAttribute;
  };

  return { updateAttribute, loading, error };
};

export const useDeleteAttribute = () => {
  const [deleteAttributeMutation, { loading, error }] = useMutation(
    DELETE_ATTRIBUTE,
    {
      refetchQueries: [{ query: GET_ATTRIBUTES }],
      onError: (err) => {
        console.error("Error deleting attribute:", err);
      },
    }
  );

  const deleteAttribute = async (id: string) => {
    const { data } = await deleteAttributeMutation({
      variables: { id },
    });
    return data?.deleteAttribute;
  };

  return { deleteAttribute, loading, error };
};
