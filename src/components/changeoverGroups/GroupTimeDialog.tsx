import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IChangeoverGroup } from "../../graphql/interfaces";
import {
  Clock,
  X,
  Tag,
  Plus,
  LoaderCircle,
  Trash2,
  Grid3X3,
  Square,
  CheckSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAttributes } from "../../graphql/hook/attribute";
import {
  useSetChangeoverTime,
  useDeleteChangeoverTime,
} from "../../graphql/hook/changeover";
import { toast } from "react-toastify";
import MatrixConfigurationDialog from "./MatrixConfigurationDialog";
import ConfirmationDialog from "../general/ConfirmDialog";

interface Props {
  group: IChangeoverGroup;
}

const GroupTimesDialog: React.FC<Props> = ({ group }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [selectedAttrId, setSelectedAttrId] = useState<string>("");
  const [timeValue, setTimeValue] = useState<string>("");
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  // Matrix Sub-Dialog State
  const [matrixDialogState, setMatrixDialogState] = useState<{
    open: boolean;
    attrId: number;
  }>({ open: false, attrId: 0 });

  // Data Hooks
  const { attributes, loading: loadingAttrs } = useAttributes();
  const { setChangeoverTime, loading: saving } = useSetChangeoverTime();
  const { deleteChangeoverTime, loading: deleting } = useDeleteChangeoverTime();

  const times = group.changeoverTimes || [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttrId) return;
    // If NOT in matrix mode, we strictly need a time value
    if (!isMatrixMode && !timeValue) return;

    try {
      // Send NULL if matrix mode, otherwise parse the float value
      const payloadTime = isMatrixMode ? null : parseFloat(timeValue);

      await setChangeoverTime(
        Number(group.id),
        Number(selectedAttrId),
        payloadTime
      );
      toast.success(t("changeoverGroupsPage.timesDialog.addSuccess"));

      // Reset form
      setSelectedAttrId("");
      setTimeValue("");
      setIsMatrixMode(false);
    } catch (error) {
      toast.error(t("errors.errorGeneral"));
    }
  };

  const handleDelete = async (timeId: string) => {
    try {
      await deleteChangeoverTime(Number(timeId));
      toast.success(t("changeoverGroupsPage.timesDialog.deleteSuccess"));
    } catch (error) {
      toast.error(t("errors.errorGeneral"));
    }
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button className="flex items-center justify-center space-x-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors text-xs font-medium border border-purple-200">
            <Clock className="w-3 h-3" />
            <span>
              {times.length} {t("changeoverGroupsPage.details", "Details")}
            </span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 fixed inset-0 z-40 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-0 z-50 animate-in zoom-in-95 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <Dialog.Title className="text-lg font-bold text-gray-800">
                  {group.name}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                  {t("changeoverGroupsPage.timesDialog.subtitle")}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>

            {/* Form Section */}
            <div className="p-4 bg-gray-50 border-b">
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                      {t("changeoverGroupsPage.timesDialog.attributeLabel")}
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
                      value={selectedAttrId}
                      onChange={(e) => setSelectedAttrId(e.target.value)}
                      disabled={loadingAttrs}
                    >
                      <option value="" disabled>
                        {t("common.select", "Select...")}
                      </option>
                      {attributes.map((attr) => (
                        <option key={attr.id} value={attr.id}>
                          {attr.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Hide Time Input if Matrix Mode is Active */}
                  {!isMatrixMode && (
                    <div className="w-24">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                        {t("changeoverGroupsPage.timesDialog.timeLabel")}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        value={timeValue}
                        onChange={(e) => setTimeValue(e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      !selectedAttrId || (!isMatrixMode && !timeValue) || saving
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                  >
                    {saving ? (
                      <LoaderCircle className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1" />
                        {t("common.add", "Add")}
                      </>
                    )}
                  </button>
                </div>

                {/* Matrix Toggle Checkbox */}
                <div
                  className="flex items-center gap-2 cursor-pointer self-start select-none"
                  onClick={() => setIsMatrixMode(!isMatrixMode)}
                >
                  {isMatrixMode ? (
                    <CheckSquare className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {t(
                      "changeoverGroupsPage.timesDialog.useMatrix",
                      "Use detailed matrix instead of fixed time"
                    )}
                  </span>
                </div>
              </form>
            </div>

            {/* List Section */}
            <div className="overflow-y-auto p-4 flex-1">
              {times.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>{t("changeoverGroupsPage.timesDialog.noData")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {times.map((item) => {
                    // Check if Time is Null (Matrix Mode)
                    const isMatrix =
                      item.changeoverTime === null ||
                      item.changeoverTime === undefined;

                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md">
                            <Tag className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-700">
                            {item.attribute?.name || "Unknown"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Display Matrix Button OR Time Badge */}
                          {isMatrix ? (
                            <button
                              onClick={() =>
                                setMatrixDialogState({
                                  open: true,
                                  attrId: Number(item.attributeId),
                                })
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors text-xs font-semibold"
                            >
                              <Grid3X3 className="w-3.5 h-3.5" />
                              {t("common.matrixConfig", "Matrix Config")}
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                              <Clock className="w-3.5 h-3.5 text-gray-500" />
                              <span className="font-semibold text-gray-900 text-sm">
                                {item.changeoverTime} min
                              </span>
                            </div>
                          )}

                          <ConfirmationDialog
                            title={t("common.deleteTitle", "Delete")}
                            description={t(
                              "changeoverGroupsPage.timesDialog.deleteDesc",
                              "Are you sure you want to delete this configuration?"
                            )}
                            confirmAction={() => handleDelete(item.id)}
                            confirmText={t("common.delete", "Delete")}
                            triggerButton={
                              <button
                                disabled={deleting}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                title={t("common.delete")}
                              >
                                {deleting ? (
                                  <LoaderCircle className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  {t("common.close", "Close")}
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Render Matrix Configuration Sub-Dialog */}
      {matrixDialogState.open && (
        <MatrixConfigurationDialog
          isOpen={matrixDialogState.open}
          onClose={() => setMatrixDialogState({ open: false, attrId: 0 })}
          groupId={Number(group.id)}
          attributeId={matrixDialogState.attrId}
          groupName={group.name}
        />
      )}
    </>
  );
};

export default GroupTimesDialog;
