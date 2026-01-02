import { useMutation } from "@apollo/client";
import { RUN_SCHEDULER } from "../mutation/python-scheduler";

export const useRunScheduler = () => {
  const [runSchedulerMutation, { data, loading, error }] =
    useMutation(RUN_SCHEDULER);
  return {
    runScheduler: runSchedulerMutation,
    data,
    loading,
    error,
  };
};
