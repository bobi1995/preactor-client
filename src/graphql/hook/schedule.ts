import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SCHEDULES,
  GET_SCHEDULE,
  UPDATE_SCHEDULE,
  CREATE_SCHEDULE,
  DELETE_SCHEDULE,
} from "../query/schedule";

export const useSchedules = () => {
  const { data, loading, error, refetch } = useQuery(GET_SCHEDULES);
  return {
    schedules: data?.schedules || [],
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useSchedule = (id: number) => {
  const { data, loading, error, refetch } = useQuery(GET_SCHEDULE, {
    variables: { getScheduleId: id },
    skip: !id, // Don't run the query if there's no ID
  });
  return {
    schedule: data?.schedule,
    loading,
    error,
    reload: () => refetch(),
  };
};

// MODIFIED: This hook now takes all day IDs to create a full schedule
export const useCreateSchedule = () => {
  const [mutate, { loading }] = useMutation(CREATE_SCHEDULE, {
    // Refetch the list of all schedules after creating a new one
    refetchQueries: [{ query: GET_SCHEDULES }],
  });
  const createSchedule = async (name: string) => {
    const { data } = await mutate({
      variables: {
        // Create a new schedule with a name and all days set to null
        input: {
          name,
          mondayId: null,
          tuesdayId: null,
          wednesdayId: null,
          thursdayId: null,
          fridayId: null,
          saturdayId: null,
          sundayId: null,
        },
      },
    });
    return data.createSchedule; // Return the new schedule object (including its ID)
  };
  return { createSchedule, loading };
};

export const useUpdateSchedule = () => {
  const [mutate, { loading }] = useMutation(UPDATE_SCHEDULE);

  const updateSchedule = async (updateScheduleId: string, input: any) => {
    const { data } = await mutate({
      variables: { updateScheduleId, input },
      refetchQueries: [
        {
          query: GET_SCHEDULE,
          variables: { getScheduleId: updateScheduleId },
        },
      ],
      awaitRefetchQueries: true,
    });
    return data.updateSchedule;
  };

  return {
    updateSchedule,
    loading,
  };
};

export const useDeleteSchedule = () => {
  const [mutate, { loading }] = useMutation(DELETE_SCHEDULE, {
    refetchQueries: [{ query: GET_SCHEDULES }],
  });
  const remove = async (id: string) => {
    await mutate({
      variables: { deleteScheduleId: id },
    });
  };
  return {
    remove,
    loading,
  };
};
