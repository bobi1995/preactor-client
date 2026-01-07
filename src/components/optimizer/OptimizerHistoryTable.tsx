import React from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { IResource } from "../../graphql/interfaces";

export interface IOptimizerExecution {
  id: number;
  startTime: string;
  durationSeconds?: number;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  strategy: string;
  recordCount?: number;
  resourcePriority?: number[];
  errorMessage?: string;
}

interface Props {
  executions: IOptimizerExecution[];
  resources: IResource[];
}

const OptimizerHistoryTable: React.FC<Props> = ({ executions, resources }) => {
  const { t } = useTranslation(); // 2. Initialize hook

  const resourceMap = new Map(resources.map((r) => [Number(r.id), r.name]));

  // Helper to translate database strategy strings to UI text
  const getStrategyLabel = (dbStrategy: string) => {
    switch (dbStrategy) {
      case "balanced":
        return t("optimizer.strategy.balanced", "Balanced");
      case "minimize_setup":
        return t("optimizer.strategy.minimizeSetup", "Minimize Setup");
      case "deadline":
        return t("optimizer.strategy.deadline", "Deadline");
      default:
        return dbStrategy;
    }
  };

  const getStatusBadge = (status: string, error?: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-full text-xs font-medium border border-green-100">
            <CheckCircle className="w-3 h-3" />{" "}
            {t("optimizer.table.success", "Success")}
          </span>
        );
      case "FAILED":
        return (
          <span
            className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-medium border border-red-100"
            title={error}
          >
            <XCircle className="w-3 h-3" />{" "}
            {t("optimizer.table.failed", "Failed")}
          </span>
        );
      case "RUNNING":
        return (
          <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded-full text-xs font-medium border border-blue-100 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />{" "}
            {t("optimizer.table.running", "Running")}
          </span>
        );
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  const formatPriorityList = (ids?: number[]) => {
    if (!ids || ids.length === 0) return "-";
    const names = ids.map((id) => resourceMap.get(id) || `ID:${id}`);
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
  };

  return (
    <div className="overflow-auto border rounded-lg shadow-sm max-h-96 relative bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("optimizer.table.status", "Status")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("optimizer.table.date", "Date")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("optimizer.table.duration", "Duration")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("optimizer.table.records", "Records")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("optimizer.table.strategy", "Strategy")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("optimizer.table.priority", "Resource Priority")}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {executions.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-gray-400 text-sm"
              >
                {t("optimizer.table.noHistory", "No execution history found.")}
              </td>
            </tr>
          ) : (
            executions.map((exec) => (
              <tr key={exec.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(exec.status, exec.errorMessage)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(exec.startTime), "PP p")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                  {exec.durationSeconds
                    ? `${exec.durationSeconds.toFixed(2)}s`
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  {exec.recordCount ?? "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {getStrategyLabel(exec.strategy)}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-xs text-gray-500"
                  title={exec.resourcePriority?.join(", ")}
                >
                  {formatPriorityList(exec.resourcePriority)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OptimizerHistoryTable;
