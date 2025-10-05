import { DELETE_SHIFT_MUTATION, UPDATE_SHIFT } from "../mutation/shift";
import { GET_SHIFT, GET_SHIFTS } from "../query/shift";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { CREATE_SHIFT } from "../mutation/shift";

interface IUpdateShift {
  name: string;
  startHour: string;
  endHour: string;
}

export const useShifts = () => {
  const { data, loading, error, refetch } = useQuery(GET_SHIFTS);
  return {
    shifts: data?.shifts,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useShift = (id: number) => {
  const { data, loading, error, refetch } = useQuery(GET_SHIFT, {
    variables: { getShiftId: id },
  });
  return {
    shift: data?.shift,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useCreateShift = () => {
  const [mutate, { loading }] = useMutation(CREATE_SHIFT, {
    refetchQueries: [
      {
        query: GET_SHIFTS,
      },
    ],
  });
  const createShift = async (
    name: string,
    startHour: string,
    endHour: string
  ) => {
    const {
      data: { shift },
    } = await mutate({
      variables: { input: { name, startHour, endHour } },
    });
    return shift;
  };
  return {
    createShift,
    loading,
  };
};

export const useUpdateShift = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_SHIFT, {
    refetchQueries: [
      {
        query: GET_SHIFTS,
      },
    ],
  });
  const updateShift = async (
    id: string,
    { name, startHour, endHour }: IUpdateShift
  ) => {
    const {
      data: { updateShift },
    } = await mutate({
      variables: { updateShiftId: id, input: { name, startHour, endHour } },
    });
    return updateShift;
  };
  return {
    updateShift,
    loading,
    error,
  };
};

export const useDeleteShift = () => {
  const [mutate, { loading }] = useMutation(DELETE_SHIFT_MUTATION, {
    // We update the cache manually or refetch after a successful mutation
    refetchQueries: [{ query: GET_SHIFTS }],
  });

  const deleteShift = async (id: string) => {
    try {
      const response = await mutate({
        variables: { deleteShiftId: id },
      });
      return response.data;
    } catch (error: any) {
      // Check if this is an ApolloError and if it has a specific code
      if (
        error instanceof ApolloError &&
        error.graphQLErrors[0]?.extensions?.code
      ) {
        // This is our custom error from the backend.
        // We re-throw an error where the message IS the code.
        throw new Error(error.graphQLErrors[0].extensions.code as string);
      }
      // This handles network errors or other unexpected issues
      console.error("Unhandled error in useDeleteShift:", error);
      throw new Error("INTERNAL_SERVER_ERROR");
    }
  };

  return { deleteShift, loading };
};
