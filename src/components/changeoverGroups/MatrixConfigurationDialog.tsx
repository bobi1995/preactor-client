import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { X, ArrowRight, Save, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  useSetChangeoverData,
  useChangeoverMatrix,
  useDeleteChangeoverData,
} from "../../graphql/hook/changeover";
import { IChangeoverData, IAttribute } from "../../graphql/interfaces";
import ConfirmationDialog from "../general/ConfirmDialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
  attributeId: number;
  groupName: string;
}

const MatrixConfigurationDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  groupId,
  attributeId,
  groupName,
}) => {
  const { t } = useTranslation();

  // Form State
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [time, setTime] = useState("");

  // Queries & Mutations
  const { matrixData, loading } = useChangeoverMatrix(groupId, attributeId);
  const { setChangeoverData, loading: saving } = useSetChangeoverData();
  const { deleteChangeoverData, loading: deleting } = useDeleteChangeoverData(
    groupId,
    attributeId
  );

  // Helper getters
  const attribute = matrixData?.getAttribute as IAttribute;
  const matrixDataList = (matrixData?.getChangeoverDataMatrix ||
    []) as IChangeoverData[];
  const params = attribute?.attributeParameters || [];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId || !time) return;

    try {
      await setChangeoverData(
        groupId,
        attributeId,
        Number(fromId),
        Number(toId),
        parseFloat(time)
      );
      toast.success(t("common.saved", "Saved"));
      setTime(""); // Clear time for next entry
    } catch (err) {
      toast.error(t("errors.errorGeneral"));
    }
  };

  // Logic to pass to the Confirmation Dialog
  const handleConfirmDelete = async (id: number) => {
    if (deleting) return;
    await deleteChangeoverData(id);
    toast.success(
      t("changeoverGroupsPage.matrixDialog.successDeleted", "Deleted")
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-[60] animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-0 z-[70] animate-in zoom-in-95 flex flex-col h-[85vh]">
          {/* --- 1. HEADER --- */}
          <div className="flex justify-between items-center p-5 border-b bg-indigo-50/50 rounded-t-xl shrink-0">
            <div>
              <Dialog.Title className="text-lg font-bold text-slate-800">
                {t(
                  "changeoverGroupsPage.matrixDialog.title",
                  "Matrix Configuration"
                )}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 mt-1">
                {groupName} •{" "}
                <span className="font-semibold text-indigo-600">
                  {attribute?.name || "Loading..."}
                </span>
              </Dialog.Description>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* --- 2. FORM --- */}
          <div className="p-4 bg-slate-50 border-b shrink-0">
            <form
              onSubmit={handleSave}
              className="flex flex-col sm:flex-row gap-3 items-end"
            >
              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">
                  {t("common.from", "From")}
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={fromId}
                  onChange={(e) => setFromId(e.target.value)}
                >
                  <option value="">{t("common.select", "Select...")}</option>
                  {params.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.attributeValue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden sm:flex items-center pb-2 text-slate-400">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">
                  {t("common.to", "To")}
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={toId}
                  onChange={(e) => setToId(e.target.value)}
                >
                  <option value="">{t("common.select", "Select...")}</option>
                  {params.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.attributeValue}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-28">
                <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">
                  {t("common.timeMin", "Time (min)")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="0"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !fromId || !toId || !time}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
              </button>
            </form>
          </div>

          {/* --- 3. TABLE --- */}
          <div className="flex-1 overflow-y-auto p-0 bg-white">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <LoaderCircle className="animate-spin text-indigo-600 w-8 h-8" />
              </div>
            ) : matrixDataList.length === 0 ? (
              <div className="text-center text-slate-400 py-12 flex flex-col items-center justify-center h-full">
                <p>
                  {t(
                    "changeoverGroupsPage.matrixDialog.noData",
                    "No matrix rules defined yet."
                  )}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 font-semibold">
                      {t("common.from", "From")}
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      {t("common.to", "To")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-right">
                      {t("common.timeMin", "Setup Time")}
                    </th>
                    <th className="px-6 py-3 font-semibold text-right">
                      {t("common.actions", "Actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matrixDataList.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium text-slate-700">
                        {row.fromAttributeParameter?.attributeValue}
                      </td>
                      <td className="px-6 py-3 font-medium text-slate-700">
                        {row.toAttributeParameter?.attributeValue}
                      </td>
                      <td className="px-6 py-3 text-right text-indigo-600 font-bold">
                        {row.setupTime} min
                      </td>
                      <td className="px-6 py-3 text-right">
                        {/* Implemented ConfirmationDialog here */}
                        <ConfirmationDialog
                          title={t(
                            "changeoverGroupsPage.matrixDialog.deleteTitle",
                            "Delete"
                          )}
                          description={t(
                            "changeoverGroupsPage.matrixDialog.deleteDescription",
                            "Are you sure you want to delete this rule?"
                          )}
                          confirmAction={() => handleConfirmDelete(row.id)}
                          confirmText={t("common.delete", "Delete")}
                          triggerButton={
                            <button
                              title={t("common.delete")}
                              className="p-1.5 rounded-full hover:bg-red-50 transition-colors group"
                              disabled={deleting}
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                            </button>
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MatrixConfigurationDialog;
