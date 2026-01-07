import React, { useMemo } from "react";
import { useTranslation } from "react-i18next"; // 1. Import hook
import { IResource } from "../../graphql/interfaces";
import { ArrowUp, ArrowDown, Plus, X } from "lucide-react";

interface Props {
  allResources: IResource[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

const ResourcePrioritySelector: React.FC<Props> = ({
  allResources,
  selectedIds,
  onChange,
}) => {
  const { t } = useTranslation(); // 2. Initialize hook

  // Map for quick lookup
  const resourceMap = useMemo(() => {
    return new Map(allResources.map((r) => [Number(r.id), r]));
  }, [allResources]);

  // Derived lists
  const selectedResources = selectedIds
    .map((id) => resourceMap.get(id))
    .filter((r): r is IResource => !!r);

  const availableResources = allResources.filter(
    (r) => !selectedIds.includes(Number(r.id))
  );

  // Handlers
  const handleAdd = (id: string) => {
    onChange([...selectedIds, Number(id)]);
  };

  const handleRemove = (idToRemove: number) => {
    onChange(selectedIds.filter((id) => id !== idToRemove));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= selectedIds.length)
      return;
    const newIds = [...selectedIds];
    const temp = newIds[index];
    newIds[index] = newIds[index + direction];
    newIds[index + direction] = temp;
    onChange(newIds);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96">
      {/* LEFT: Available */}
      <div className="border rounded-lg flex flex-col bg-white overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-3 py-2 border-b font-medium text-sm text-gray-700">
          {t("optimizer.resourcePriority.available", "Available Resources")}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {availableResources.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-4">
              {t("optimizer.resourcePriority.allAdded", "All resources added")}
            </p>
          )}
          {availableResources.map((r) => (
            <div
              key={r.id}
              onClick={() => handleAdd(r.id)}
              className="flex items-center justify-between p-2 hover:bg-indigo-50 rounded cursor-pointer group transition-colors border border-transparent hover:border-indigo-100"
            >
              <span className="text-sm text-gray-700">{r.name}</span>
              <Plus className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Priority List */}
      <div className="border rounded-lg flex flex-col bg-white overflow-hidden shadow-sm border-indigo-200">
        <div className="bg-indigo-50 px-3 py-2 border-b border-indigo-100 font-medium text-sm text-indigo-800 flex justify-between items-center">
          <span>
            {t(
              "optimizer.resourcePriority.priorityQueue",
              "Priority Queue (High to Low)"
            )}
          </span>
          <span className="text-xs text-indigo-500 font-normal">
            {selectedIds.length}{" "}
            {t("optimizer.resourcePriority.items", "items")}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
          {/* Background Arrow Graphic */}
          <div className="absolute right-2 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-full pointer-events-none"></div>

          {selectedResources.length === 0 && (
            <p className="text-xs text-gray-400 text-center mt-4">
              {t(
                "optimizer.resourcePriority.empty",
                "No resources selected. System will use default logic."
              )}
            </p>
          )}
          {selectedResources.map((r, idx) => (
            <div
              key={r.id}
              className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded shadow-sm"
            >
              <div className="flex flex-col gap-1 text-gray-400">
                {/* Up Button */}
                <button
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0}
                  className="hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                {/* Down Button */}
                <button
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === selectedResources.length - 1}
                  className="hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {t("optimizer.table.priority", "Priority")} {idx + 1}
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {r.name}
                </div>
              </div>

              <button
                onClick={() => handleRemove(Number(r.id))}
                className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcePrioritySelector;
