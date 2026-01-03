import { useMutation } from "@apollo/client";
import {
  ADD_ORDER_ATTRIBUTE,
  DELETE_ORDER_ATTRIBUTE,
} from "../mutation/orderAttribute";
import { GET_ORDERS } from "../query/order"; // Changed import

export const useAddOrderAttribute = () => {
  const [mutate, { loading, error }] = useMutation(ADD_ORDER_ATTRIBUTE, {
    // Refetch the main orders list
    refetchQueries: [{ query: GET_ORDERS }],
  });

  const addOrderAttribute = async (
    orderId: number,
    attributeId: number,
    value?: string,
    attributeParamId?: number
  ) => {
    return await mutate({
      variables: {
        input: {
          orderId,
          attributeId,
          value,
          attributeParamId,
        },
      },
    });
  };

  return { addOrderAttribute, loading, error };
};

export const useDeleteOrderAttribute = () => {
  const [mutate, { loading, error }] = useMutation(DELETE_ORDER_ATTRIBUTE, {
    refetchQueries: [{ query: GET_ORDERS }],
  });

  const deleteOrderAttribute = async (id: number) => {
    return await mutate({
      variables: { id },
    });
  };

  return { deleteOrderAttribute, loading, error };
};
