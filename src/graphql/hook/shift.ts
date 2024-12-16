import {
  assignBreakMutation,
  createShiftMutation,
  getBreaks,
  getShift,
  getShifts,
} from "../query/shift";
import { useQuery, useMutation } from "@apollo/client";

export const useShifts = () => {
  const { data, loading, error, refetch } = useQuery(getShifts);
  return {
    shifts: data?.shifts,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useShift = (id: string) => {
  const { data, loading, error, refetch } = useQuery(getShift, {
    variables: { id },
  });
  return {
    shift: data?.shift,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useBreaks = () => {
  const { data, loading, error, refetch } = useQuery(getBreaks);
  return {
    breaks: data?.breaks,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useCreateShift = () => {
  const [mutate, { loading }] = useMutation(createShiftMutation);
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

export const useAssignBreak = () => {
  const [mutate, { loading }] = useMutation(assignBreakMutation);
  const assignBreak = async (shiftId: string, breakId: string) => {
    const {
      data: { assignBreakToShift },
    } = await mutate({
      variables: { shiftId, breakId },
    });
    return assignBreakToShift;
  };
  return {
    assignBreak,
    loading,
  };
};
