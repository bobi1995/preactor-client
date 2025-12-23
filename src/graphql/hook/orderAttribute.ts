import { useMutation } from "@apollo/client";
import {
  ADD_ORDER_ATTRIBUTE,
  DELETE_ORDER_ATTRIBUTE,
} from "../mutation/orderAttribute";
import { GET_RAW_ORDERS } from "../query/orderRaw";

export const useAddOrderAttribute = () => {
  const [mutate, { loading, error }] = useMutation(ADD_ORDER_ATTRIBUTE, {
    // Refetch orders to update the list in the table/modal immediately
    refetchQueries: [{ query: GET_RAW_ORDERS }],
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
    refetchQueries: [{ query: GET_RAW_ORDERS }],
  });

  const deleteOrderAttribute = async (id: number) => {
    return await mutate({
      variables: { id },
    });
  };

  return { deleteOrderAttribute, loading, error };
};
