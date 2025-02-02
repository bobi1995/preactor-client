import { useQuery, useMutation } from "@apollo/client";
import { CREATE_GROUP, GET_GROUPS } from "../query/group";

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
