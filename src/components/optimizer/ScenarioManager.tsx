import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOptimizationScenarios } from "../../graphql/hook/optimizationScenario";
import { IOptimizationScenario } from "../../graphql/interfaces";
import { Edit2, Trash2, Plus, X, Save, Sliders, Star } from "lucide-react";
import { toast } from "react-toastify";
import LoadingDialog from "../general/LoadingDialog";

const ScenarioManager: React.FC = () => {
  const { t } = useTranslation();
  const {
    scenarios,
    loading,
    createScenario,
    updateScenario,
    deleteScenario,
    setDefaultScenario,
    isActionLoading,
  } = useOptimizationScenarios();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<IOptimizationScenario>>({
    latenessWeight: 100,
    changeoverWeight: 100,
    makespanWeight: 100,
    loadRangeWeight: 10,
    maxLoadWeight: 10,
    gravityWeight: 1,
  });

  const sortedScenarios = useMemo(() => {
    return [...scenarios].sort((a, b) => {
      if (a.isDefault === b.isDefault) return a.name.localeCompare(b.name);
      return a.isDefault ? -1 : 1;
    });
  }, [scenarios]);

  const resetForm = () => {
    setFormData({
      latenessWeight: 100,
      changeoverWeight: 100,
      makespanWeight: 100,
      loadRangeWeight: 10,
      maxLoadWeight: 10,
      gravityWeight: 1,
    });
    setIsEditing(false);
  };

  const handleEdit = (scenario: IOptimizationScenario) => {
    setFormData(scenario);
    setIsEditing(true);
  };

  const handleSetDefault = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await setDefaultScenario({ variables: { id } });
      toast.success(t("common.saved", "Default scenario updated"));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t("optimizer.scenario.deleteConfirm", "Delete?"))) {
      if (formData.id === id) resetForm();
      await deleteScenario({ variables: { id } });
      toast.success(t("common.deleted", "Deleted successfully"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await updateScenario({
          variables: {
            input: {
              id: formData.id,
              name: formData.name,
              description: formData.description,
              latenessWeight: Number(formData.latenessWeight),
              changeoverWeight: Number(formData.changeoverWeight),
              makespanWeight: Number(formData.makespanWeight),
              loadRangeWeight: Number(formData.loadRangeWeight),
              maxLoadWeight: Number(formData.maxLoadWeight),
              gravityWeight: Number(formData.gravityWeight),
            },
          },
        });
        toast.success(t("common.saved", "Saved successfully"));
      } else {
        const response = await createScenario({
          variables: {
            input: {
              name: formData.name,
              description: formData.description,
              latenessWeight: Number(formData.latenessWeight),
              changeoverWeight: Number(formData.changeoverWeight),
              makespanWeight: Number(formData.makespanWeight),
              loadRangeWeight: Number(formData.loadRangeWeight),
              maxLoadWeight: Number(formData.maxLoadWeight),
              gravityWeight: Number(formData.gravityWeight),
            },
          },
        });
        const newId = response.data?.createOptimizationScenario?.id;
        if (newId) {
          setFormData((prev) => ({ ...prev, id: newId }));
          setIsEditing(true);
        }
        toast.success(t("common.created", "Created successfully"));
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const renderWeightInput = (
    key: keyof IOptimizationScenario,
    labelKey: string,
    descKey: string
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t(labelKey)}
      </label>
      <input
        type="number"
        min="0"
        value={formData[key] as number}
        onChange={(e) =>
          setFormData({ ...formData, [key]: Number(e.target.value) })
        }
        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
      />
      <p className="text-xs text-gray-400 mt-1">{t(descKey)}</p>
    </div>
  );

  if (loading) return <div className="p-4">Loading Scenarios...</div>;

  return (
    // items-stretch ensures both columns have the same height
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <LoadingDialog isLoading={isActionLoading} />

      {/* LEFT: List 
          - relative: establishes a coordinate system for the absolute child
          - h-[500px]: Fixed height on mobile so it doesn't collapse
          - lg:h-auto: On desktop, match the height of the right column
      */}
      <div className="lg:col-span-1 bg-white border rounded-xl shadow-sm relative h-[500px] lg:h-auto flex flex-col">
        {/* - absolute inset-0: Forces this container to fill the parent's height exactly
            - overflow-hidden: Contains the scrollbar inside nicely
        */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-xl">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center shrink-0">
            <h3 className="font-semibold text-gray-700">
              {t("optimizer.scenario.listTitle", "Scenarios")}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* overflow-y-auto: This enables the scrollbar ONLY for the list if it gets too long */}
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {sortedScenarios.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer relative group ${
                  formData.id === s.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => handleEdit(s)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-gray-800 text-sm">
                        {s.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {s.description ||
                        t("optimizer.scenario.noDesc", "No description")}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 items-end">
                    {/* Default Button */}
                    <button
                      onClick={(e) => handleSetDefault(s.id, e)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-colors ${
                        s.isDefault
                          ? "bg-yellow-50 border-yellow-200 text-yellow-600"
                          : "bg-white border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500"
                      }`}
                      title={t(
                        "optimizer.scenario.default",
                        "Set as default scenario"
                      )}
                    >
                      <Star
                        className={`w-3 h-3 ${
                          s.isDefault ? "fill-yellow-500" : ""
                        }`}
                      />
                      {s.isDefault
                        ? t("optimizer.scenario.default", "Default")
                        : t("optimizer.scenario.setAsDefault", "Set Default")}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(s.id);
                      }}
                      className="text-gray-300 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex gap-1 h-1">
                  <div
                    className="bg-red-400"
                    style={{ flex: s.latenessWeight || 1 }}
                  />
                  <div
                    className="bg-blue-400"
                    style={{ flex: s.changeoverWeight || 1 }}
                  />
                  <div
                    className="bg-green-400"
                    style={{ flex: s.makespanWeight || 1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      {/* min-h-[600px] ensures the form is always tall enough to show a decent amount of the list on the left */}
      <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm p-6 h-full min-h-[600px]">
        <div className="flex justify-between items-center mb-6 border-b pb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            {formData.id ? (
              <>
                <Edit2 className="w-5 h-5 text-indigo-600" />{" "}
                {t("optimizer.scenario.edit", "Edit Scenario")}
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-green-600" />{" "}
                {t("optimizer.scenario.new", "New Scenario")}
              </>
            )}
          </h3>
          {isEditing && (
            <button
              onClick={resetForm}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" /> {t("common.cancel", "Cancel")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("optimizer.scenario.name", "Name")}
              </label>
              <input
                required
                type="text"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("optimizer.scenario.descriptionScenario", "Description")}
              </label>
              <input
                type="text"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4" />{" "}
              {t("optimizer.scenario.weightsTitle", "Optimization Weights")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {renderWeightInput(
                "latenessWeight",
                "optimizer.weights.latenessLabel",
                "optimizer.weights.latenessDesc"
              )}
              {renderWeightInput(
                "changeoverWeight",
                "optimizer.weights.setupLabel",
                "optimizer.weights.setupDesc"
              )}
              {renderWeightInput(
                "makespanWeight",
                "optimizer.weights.makespanLabel",
                "optimizer.weights.makespanDesc"
              )}
              {renderWeightInput(
                "loadRangeWeight",
                "optimizer.weights.loadRangeLabel",
                "optimizer.weights.loadRangeDesc"
              )}
              {renderWeightInput(
                "maxLoadWeight",
                "optimizer.weights.maxLoadLabel",
                "optimizer.weights.maxLoadDesc"
              )}
              {renderWeightInput(
                "gravityWeight",
                "optimizer.weights.gravityLabel",
                "optimizer.weights.gravityDesc"
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {formData.id
                ? t("optimizer.scenario.updateBtn", "Update Scenario")
                : t("optimizer.scenario.createBtn", "Create Scenario")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScenarioManager;
