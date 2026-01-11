import React from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Cpu, History } from "lucide-react";

// Custom Hooks
import {
  useOptimizerData,
  useUpdateOptimizerSettings,
} from "../graphql/hook/optimizer";

// Components
import LoadingDialog from "../components/general/LoadingDialog";
import ErrorComponent from "../components/general/Error";
import OptimizerHistoryTable from "../components/optimizer/OptimizerHistoryTable";
import ScenarioManager from "../components/optimizer/ScenarioManager";
import RunOptimizerDialog from "../components/optimizer/RunOptimizerDialog";
import GlobalOptimizerSettings from "../components/optimizer/GlobalOptimizerSettings"; // New Import

const OptimizerSettingsPage: React.FC = () => {
  const { t } = useTranslation();

  // --- DATA FETCHING ---
  const { settings, executions, resources, loading, error, refetch } =
    useOptimizerData();

  const { updateSettings, loading: saving } = useUpdateOptimizerSettings();

  if (loading && !settings) return <LoadingDialog isLoading={true} />;
  if (error)
    return <ErrorComponent message={error.message} onRetry={refetch} />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 pb-20">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-indigo-600" />
            {t("optimizer.title", "Optimizer Control Center")}
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl">
            {t(
              "optimizer.subtitle",
              "Manage algorithmic scheduling strategies, global defaults, and review execution logs."
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <RunOptimizerDialog onSuccess={refetch} />

          <button
            onClick={() => refetch()}
            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 hover:border-indigo-200"
            title={t("common.refresh", "Refresh Data")}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* 2. GLOBAL DEFAULTS (New Component) */}
      <section>
        <GlobalOptimizerSettings
          settings={settings}
          resources={resources}
          updateSettings={updateSettings}
          saving={saving}
        />
      </section>

      {/* 3. SCENARIOS */}
      <section>
        <div className="mb-5 px-1">
          <h2 className="text-xl font-bold text-gray-800">
            {t("optimizer.scenario.title", "Optimization Scenarios")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "optimizer.scenario.description",
              "Create and manage different weight configurations for specific scheduling needs."
            )}
          </p>
        </div>
        <ScenarioManager />
      </section>

      {/* 4. HISTORY */}
      <section className="pt-8 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-5 px-1">
          <History className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-800">
            {t("optimizer.logs", "Execution History")}
          </h2>
        </div>
        <OptimizerHistoryTable executions={executions} resources={resources} />
      </section>
    </div>
  );
};

export default OptimizerSettingsPage;
