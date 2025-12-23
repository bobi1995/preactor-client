import { useQuery } from "@apollo/client";
import { GET_RAW_ORDERS } from "../query/orderRaw";
import { IOrderRaw } from "../interfaces";

export const useRawOrders = () => {
  const { data, loading, error, refetch } = useQuery(GET_RAW_ORDERS, {
    fetchPolicy: "network-only",
  });

  return {
    rawOrders: (data?.getRawOrders || []) as IOrderRaw[],
    loading,
    error,
    refetch,
  };
};
