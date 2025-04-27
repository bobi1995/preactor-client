import { useQuery } from "@apollo/client";

import { LN_ORDERS } from "../query/ln_orders";

export const useLnOrders = () => {
  const { data, loading, error, refetch } = useQuery(LN_ORDERS);
  return {
    orders: data?.orders,
    loading,
    error,
    reload: () => refetch(),
  };
};
