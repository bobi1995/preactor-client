import { useMutation, useQuery } from "@apollo/client";
import {
  getSchedules,
  getSchedule,
  updateSchedule,
  createSchedule,
} from "../query/schedule";

export const useSchedules = () => {
  const { data, loading, error, refetch } = useQuery(getSchedules);
  return {
    schedules: data?.schedules,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useSchedule = (id: string) => {
  const { data, loading, error, refetch } = useQuery(getSchedule, {
    variables: { getScheduleId: id },
  });

  return {
    schedule: data?.schedule,
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useCreateSchedule = () => {
  const [mutate, { loading }] = useMutation(createSchedule);
  const create = async (name: string) => {
    const {
      data: { createSchedule },
    } = await mutate({
      variables: { name },
    });
    return createSchedule;
  };
  return {
    create,
    loading,
  };
};

export const useUpdateSchedule = () => {
  const [mutate, { loading }] = useMutation(updateSchedule);
  const update = async (updateScheduleId: string, input: any) => {
    const {
      data: { updateSchedule },
    } = await mutate({
      variables: { updateScheduleId, input },
    });
    return updateSchedule;
  };
  return {
    update,
    loading,
  };
};
