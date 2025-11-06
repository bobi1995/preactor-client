import { useMutation, useQuery } from "@apollo/client";
import {
  GET_SCHEDULES,
  GET_SCHEDULE,
  GET_SCHEDULES_MINIMAL,
} from "../query/schedule";
import {
  CREATE_SCHEDULE,
  UPDATE_SCHEDULE,
  DELETE_SCHEDULE,
} from "../mutation/schedule";
import { ApolloError } from "@apollo/client/errors";

export const useSchedules = () => {
  const { data, loading, error, refetch } = useQuery(GET_SCHEDULES);
  return {
    schedules: data?.schedules || [],
    loading,
    error,
    reload: () => refetch(),
  };
};

export const useSchedulesMinimal = () => {
  const { data, loading, error, refetch } = useQuery(GET_SCHEDULES_MINIMAL);
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

export const useCreateSchedule = () => {
  const [mutate, { loading }] = useMutation(CREATE_SCHEDULE, {
    refetchQueries: [{ query: GET_SCHEDULES }],
  });
  const createSchedule = async (name: string) => {
    try {
      const { data } = await mutate({
        variables: {
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
      return data.createSchedule;
    } catch (error: any) {
      // FIX: Add the same error handling logic as your delete hook
      if (
        error instanceof ApolloError &&
        error.graphQLErrors[0]?.extensions?.code
      ) {
        // Re-throw an error where the message IS the specific code
        throw new Error(error.graphQLErrors[0].extensions.code as string);
      }
      // For any other kind of error, throw a generic code
      console.error("Unhandled error in useCreateSchedule:", error);
      throw new Error("INTERNAL_SERVER_ERROR");
    }
  };
  return { createSchedule, loading };
};

export const useUpdateSchedule = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_SCHEDULE);

  const updateSchedule = async (updateScheduleId: string, input: any) => {
    try {
      const { data } = await mutate({
        variables: { updateScheduleId, input },
        refetchQueries: [
          {
            query: GET_SCHEDULE,
            variables: { getScheduleId: parseInt(updateScheduleId) },
          },
          { query: GET_SCHEDULES },
        ],
        awaitRefetchQueries: true,
      });
      return data.updateSchedule;
    } catch (error) {
      if (
        error instanceof ApolloError &&
        error.graphQLErrors[0]?.extensions?.code
      ) {
        throw new Error(error.graphQLErrors[0].extensions.code as string);
      }
      throw new Error("INTERNAL_SERVER_ERROR");
    }
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
