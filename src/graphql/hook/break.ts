import { REMOVE_BREAK_FROM_SHIFT } from "../query/break";
import { useMutation } from "@apollo/client";
import { GET_SHIFT } from "../query/shift";

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
