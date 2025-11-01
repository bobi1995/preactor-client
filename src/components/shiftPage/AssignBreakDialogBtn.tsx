// src/components/shiftPage/AssignBreakDialogBtn.tsx

import React, { useState, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import ErrorComponent from "../general/Error";
import { IBreaks } from "../../graphql/interfaces";
import CreateNewBreakBtn from "./CreateNewBreakBtn";
import { useTranslation } from "react-i18next";
import { useBreaks, useAssignBreak } from "../../graphql/hook/break";
import { ChevronsUpDown } from "lucide-react";
import Spinner from "../general/Spinner";
import { toast } from "react-toastify";
import { XIcon, Plus } from "lucide-react";

interface AssignBreakDialogBtnProps {
  shiftId: string;
  assignedBreaks: IBreaks[]; // 1. Accept the list of currently assigned breaks
  onAssignmentSuccess?: () => void;
}

const DialogContent: React.FC<{
  shiftId: string;
  assignedBreaks: IBreaks[]; // Pass down to content
  setIsOpen: (isOpen: boolean) => void;
  onAssignmentSuccess?: () => void;
}> = ({ shiftId, assignedBreaks, setIsOpen, onAssignmentSuccess }) => {
  const { t } = useTranslation();
  const { breaks: allBreaks, loading, error, reload } = useBreaks();
  const { assignBreak, loading: assignLoading } = useAssignBreak();
  const [selectedBreakId, setSelectedBreakId] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // 2. Filter the list of all breaks to exclude those already assigned
  const availableBreaks = useMemo(() => {
    if (!allBreaks) return [];
    const assignedBreakIds = new Set(assignedBreaks.map((b) => b.id));
    return allBreaks.filter(
      (breakItem: IBreaks) => !assignedBreakIds.has(breakItem.id)
    );
  }, [allBreaks, assignedBreaks]);

  const handleSubmit = async () => {
    if (!selectedBreakId) return;
    setSubmissionError(null);
    try {
      await assignBreak(shiftId, selectedBreakId);
      setIsOpen(false);
      onAssignmentSuccess?.();
      toast.success(t("assignBreakDialog.assignmentSuccess"));
    } catch (e: any) {
      setSubmissionError(e.message || t("assignBreakDialog.assignmentFailed"));
    }
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmissionError(null);
    setSelectedBreakId(e.target.value);
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm";

  return (
    <>
      <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
        {t("assignBreakDialog.title")}
      </Dialog.Title>
      <Dialog.Description className="mb-5 text-sm text-slate-500">
        {t("assignBreakDialog.description")}
      </Dialog.Description>

      {error && (
        <div className="my-4">
          <ErrorComponent
            message={t("assignBreakDialog.unableToFetch")}
            onRetry={reload}
          />
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="break-select"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {t("assignBreakDialog.label")}
          </label>
          <div className="relative">
            <select
              id="break-select"
              value={selectedBreakId}
              onChange={handleSelectionChange}
              disabled={loading}
              className={`${selectClassName} ${
                loading ? "bg-slate-100 cursor-wait" : ""
              }`}
            >
              <option value="" disabled>
                {loading
                  ? t("common.loading")
                  : t("assignBreakDialog.placeholder")}
              </option>
              {/* 3. Map over the new, filtered list */}
              {!loading &&
                availableBreaks.map((br: IBreaks) => (
                  <option key={br.id} value={br.id}>
                    {br.name} ({br.startTime.slice(0, 5)} -{" "}
                    {br.endTime.slice(0, 5)})
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
              {loading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4" />
              )}
            </div>
          </div>
          {/* 4. Show a message if there are no available breaks to assign */}
          {!loading && availableBreaks.length === 0 && (
            <p className="mt-2 text-xs text-center text-slate-500 italic">
              {t("assignBreakDialog.noAvailableBreaks")}
            </p>
          )}
        </div>

        <div className="text-center text-sm text-slate-500 my-2 relative flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400">
            {t("common.or")}
          </span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <div className="flex justify-center">
          <CreateNewBreakBtn />
        </div>
      </div>

      {submissionError && (
        <div className="mt-4 text-sm text-red-700 bg-red-50 p-3 rounded-md border border-red-200">
          {submissionError}
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-3">
        <Dialog.Close asChild>
          <button
            type="button"
            disabled={assignLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            {t("common.cancel")}
          </button>
        </Dialog.Close>
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading || assignLoading || !selectedBreakId}
        >
          {assignLoading && (
            <Spinner className="h-4 w-4 -ml-1 mr-2 border-white/40 border-t-white" />
          )}
          {assignLoading ? t("common.saving") : t("common.save")}
        </button>
      </div>

      <Dialog.Close asChild>
        <button
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
          aria-label={t("common.closeDialog")}
        >
          <XIcon className="h-5 w-5" />
        </button>
      </Dialog.Close>
    </>
  );
};

const AssignBreakDialogBtn: React.FC<AssignBreakDialogBtnProps> = ({
  shiftId,
  assignedBreaks,
  onAssignmentSuccess,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow hover:shadow-lg transition-all">
          <Plus className="h-5 w-5" />
          {t("assignBreakDialog.assignButton")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50">
          {isOpen && (
            <DialogContent
              shiftId={shiftId}
              assignedBreaks={assignedBreaks}
              setIsOpen={setIsOpen}
              onAssignmentSuccess={onAssignmentSuccess}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AssignBreakDialogBtn;
