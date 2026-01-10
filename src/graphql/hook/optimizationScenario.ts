import { useQuery, useMutation } from "@apollo/client";
import { GET_OPTIMIZATION_SCENARIOS } from "../query/optimizationScenario";
import {
  CREATE_OPTIMIZATION_SCENARIO,
  UPDATE_OPTIMIZATION_SCENARIO,
  DELETE_OPTIMIZATION_SCENARIO,
  SET_DEFAULT_SCENARIO, // <--- Import
} from "../mutation/optimizationScenario";
import { IOptimizationScenario } from "../interfaces";

export const useOptimizationScenarios = () => {
  const { data, loading, error, refetch } = useQuery(
    GET_OPTIMIZATION_SCENARIOS
  );

  const [createScenario, { loading: creating }] = useMutation(
    CREATE_OPTIMIZATION_SCENARIO,
    { refetchQueries: [{ query: GET_OPTIMIZATION_SCENARIOS }] }
  );

  const [updateScenario, { loading: updating }] = useMutation(
    UPDATE_OPTIMIZATION_SCENARIO,
    { refetchQueries: [{ query: GET_OPTIMIZATION_SCENARIOS }] }
  );

  const [deleteScenario, { loading: deleting }] = useMutation(
    DELETE_OPTIMIZATION_SCENARIO,
    { refetchQueries: [{ query: GET_OPTIMIZATION_SCENARIOS }] }
  );

  // 👇 ADD THIS MUTATION
  const [setDefaultScenario, { loading: settingDefault }] = useMutation(
    SET_DEFAULT_SCENARIO,
    { refetchQueries: [{ query: GET_OPTIMIZATION_SCENARIOS }] }
  );

  return {
    scenarios: (data?.getOptimizationScenarios ||
      []) as IOptimizationScenario[],
    loading,
    error,
    refetch,
    createScenario,
    updateScenario,
    deleteScenario,
    setDefaultScenario, // <--- EXPORT IT
    isActionLoading: creating || updating || deleting || settingDefault,
  };
};
