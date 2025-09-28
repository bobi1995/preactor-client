import {
  DELETE_BREAK,
  REMOVE_BREAK_FROM_SHIFT,
  UPDATE_BREAK,
} from "../query/break";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SHIFT } from "../query/shift";
import { GET_BREAKS, CREATE_BREAK } from "../query/break";
import { ASSIGN_BREAK_MUTATION } from "../mutation/break";

export const useAssignBreak = () => {
  const [mutate, { loading }] = useMutation(ASSIGN_BREAK_MUTATION);
  const assignBreak = async (shiftId: string, breakId: string) => {
    const {
      data: { assignBreakToShift },
    } = await mutate({
      variables: { shiftId, breakId },
      refetchQueries: [
        {
          query: GET_SHIFT,
          variables: { getShiftId: shiftId },
        },
      ],
      awaitRefetchQueries: true,
    });
    return assignBreakToShift;
  };
  return {
    assignBreak,
    loading,
  };
};
export const useRemoveBreakFromShift = () => {
  const [mutate, { loading }] = useMutation(REMOVE_BREAK_FROM_SHIFT);

  const removeBreakFromShift = async (shiftId: number, breakId: number) => {
    const { data } = await mutate({
      variables: { breakId, shiftId },
      refetchQueries: [{ query: GET_SHIFT, variables: { id: shiftId } }],
    });
    return data.removeBreakFromShift;
  };

  return {
    removeBreakFromShift,
    loading,
  };
};
export const useBreaks = () => {
  const { data, loading, error, refetch } = useQuery(GET_BREAKS);
  return {
    breaks: data?.breaks,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useCreateBreak = () => {
  const [mutate, { loading, error }] = useMutation(CREATE_BREAK, {
    refetchQueries: [
      {
        query: GET_BREAKS,
      },
    ],
  });
  const createBreak = async (
    name: string,
    startTime: string,
    endTime: string
  ) => {
    const {
      data: { createBreak },
    } = await mutate({
      variables: { input: { name, startTime, endTime } },
      update: (cache, { data }) => {
        if (data?.createBreak) {
          console.log("here");
          const newBreak = data.createBreak;
          cache.modify({
            fields: {
              breaks(existingBreaks = []) {
                console.log(existingBreaks);
                return [...existingBreaks, newBreak];
              },
            },
          });
        }
      },
    });
    return createBreak;
  };
  return {
    createBreak,
    loading,
    error,
  };
};

export const useDeleteBreak = () => {
  const [mutate, { loading, error }] = useMutation(DELETE_BREAK, {
    refetchQueries: [{ query: GET_BREAKS }],
  });

  const deleteBreak = async (id: string) => {
    try {
      const response = await mutate({ variables: { id } });
      return response.data.deleteBreak;
    } catch (e) {
      console.error("Error during deleteBreak mutation:", e);
      return null;
    }
  };

  return {
    deleteBreak,
    loading,
    error,
  };
};

export const useUpdateBreak = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_BREAK, {
    refetchQueries: [{ query: GET_BREAKS }],
  });
  const updateBreak = async (
    id: string,
    name: string,
    startTime: string,
    endTime: string
  ) => {
    const {
      data: { updateBreak },
    } = await mutate({
      variables: { id, input: { name, startTime, endTime } },
    });
    return updateBreak;
  };
  return {
    updateBreak,
    loading,
    error,
  };
};
