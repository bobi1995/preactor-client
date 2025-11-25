import { useQuery } from "@apollo/client";
import {
  GET_ORDERS,
  GET_ORDERS_BY_RESOURCE,
  GET_ORDERS_BY_RESOURCE_GROUP,
} from "../query/order";

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
