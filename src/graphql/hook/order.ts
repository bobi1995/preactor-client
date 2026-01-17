import { useQuery, useMutation } from "@apollo/client";
import {
  GET_ORDERS,
  GET_ORDERS_BY_RESOURCE,
  GET_ORDERS_BY_RESOURCE_GROUP,
} from "../query/order";
import { UPDATE_ORDER } from "../mutation/order";

export const useOrders = () => {
  const { data, loading, error, refetch } = useQuery(GET_ORDERS);
  return {
    orders: data?.orders || [],
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useOrdersByResource = (resourceId: number) => {
  const { data, loading, error, refetch } = useQuery(GET_ORDERS_BY_RESOURCE, {
    variables: { resourceId },
    skip: !resourceId,
  });
  return {
    orders: data?.orders || [],
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useOrdersByResourceGroup = (resourceGroupId: number) => {
  const { data, loading, error, refetch } = useQuery(
    GET_ORDERS_BY_RESOURCE_GROUP,
    {
      variables: { resourceGroupId },
      skip: !resourceGroupId,
    }
  );
  return {
    orders: data?.orders || [],
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useUpdateOrder = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  const updateOrder = async (input: {
    id: number;
    priority?: number;
    remainingQuan?: number;
    dueDate?: string | null;
  }) => {
    return await mutate({ variables: { input } });
  };

  return { updateOrder, loading, error };
};
