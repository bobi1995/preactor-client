import { useQuery, useMutation } from "@apollo/client";
import { GET_OPTIMIZER_DATA } from "../query/optimizer";
import {
  UPDATE_OPTIMIZER_SETTINGS,
  RUN_OPTIMIZER,
} from "../mutation/optimizer";
import { IResource } from "../interfaces";
import { IOptimizerExecution } from "../../components/optimizer/OptimizerHistoryTable";

export interface OptimizerSettingsData {
  id: number;
  strategy: string;
  campaignWindowDays: number;
  gravity: boolean;
  resourcePriority: number[];
  updatedAt: string;
}

export const useOptimizerData = () => {
  const { data, loading, error, refetch } = useQuery(GET_OPTIMIZER_DATA, {
    pollInterval: 3000, // Poll faster (3s) to catch running status changes
    fetchPolicy: "network-only",
  });

  return {
    settings: (data?.getOptimizerSettings ||
      null) as OptimizerSettingsData | null,
    executions: (data?.getOptimizerExecutions || []) as IOptimizerExecution[],
    resources: (data?.getResources || []) as IResource[],
    loading,
    error,
    refetch,
  };
};

export const useUpdateOptimizerSettings = () => {
  const [mutate, { loading, error }] = useMutation(UPDATE_OPTIMIZER_SETTINGS);

  const updateSettings = async (input: {
    strategy: string;
    campaignWindowDays: number;
    gravity: boolean;
    resourcePriority: number[];
  }) => {
    const response = await mutate({
      variables: { input },
      refetchQueries: [{ query: GET_OPTIMIZER_DATA }],
    });
    return response.data?.updateOptimizerSettings;
  };

  return {
    updateSettings,
    loading,
    error,
  };
};

export const useRunOptimizer = () => {
  const [mutate, { loading, error, data }] = useMutation(RUN_OPTIMIZER);

  const runOptimizer = async (input?: {
    strategy?: string;
    campaignWindowDays?: number;
    gravity?: boolean;
    resourcePriority?: number[];
  }) => {
    const response = await mutate({
      variables: { input },
      // We refetch data immediately to see the "RUNNING" status in the history table
      refetchQueries: [{ query: GET_OPTIMIZER_DATA }],
    });
    return response.data?.runOptimizer;
  };

  return {
    runOptimizer,
    loading,
    error,
    data,
  };
};
