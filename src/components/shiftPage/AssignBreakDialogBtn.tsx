import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useAssignBreak } from "../../graphql/hook/shift";
import InfinityLoader from "../general/Loader";
import ErrorComponent from "../general/Error";
import { IBreaks } from "../../graphql/interfaces";
import CreateNewBreakBtn from "./CreateNewBreakBtn";
import { useTranslation } from "react-i18next";
import { useBreaks } from "../../graphql/hook/break";

interface AssignBreakDialogBtnProps {
  shiftId: string;
  onAssignmentSuccess?: () => void;
}

const DialogContent: React.FC<{
  shiftId: string;
  setIsOpen: (isOpen: boolean) => void;
  onAssignmentSuccess?: () => void;
}> = ({ shiftId, setIsOpen, onAssignmentSuccess }) => {
  const { t } = useTranslation();
  const { breaks, loading, error, reload } = useBreaks();
  // Assume useAssignBreak is updated to also return the error object from the mutation
  const { assignBreak, loading: assignLoading } = useAssignBreak();
  const [selectedBreakId, setSelectedBreakId] = useState<string>("");
  // State to hold submission-specific errors
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedBreakId) return;

    setSubmissionError(null); // Clear previous errors before a new attempt

    try {
      const result = await assignBreak(shiftId, selectedBreakId);

      // Check for GraphQL errors returned in the mutation result
      if (result && result.errors) {
        throw new Error(
          result.errors[0].message || t("assignBreakDialog.assignmentFailed")
        );
      }

      // If we get here, the mutation was successful
      setIsOpen(false);
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }
    } catch (e: any) {
      console.error("Failed to assign break:", e);
      // Set a user-friendly error message to display in the UI
      setSubmissionError(e.message || t("assignBreakDialog.assignmentFailed"));
    }
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubmissionError(null); // Clear error when user changes selection
    setSelectedBreakId(e.target.value);
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <>
      <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
        {t("assignBreakDialog.title")}
      </Dialog.Title>
      <Dialog.Description className="mb-5 text-sm text-slate-500">
        {t("assignBreakDialog.description")}
      </Dialog.Description>

      {/* This error is for fetching the list of breaks */}
      {error && (
        <div className="my-4">
          <ErrorComponent
            message={t("assignBreakDialog.unableToFetch")}
            onRetry={reload}
          />
        </div>
      )}

      {loading && (
        <div className="h-40 flex justify-center items-center">
          <InfinityLoader />
        </div>
      )}

      {!loading && !error && breaks && (
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
                onChange={handleSelectionChange} // Use new handler
                className={selectClassName}
              >
                <option value="" disabled>
                  {t("assignBreakDialog.placeholder")}
                </option>
                {breaks.map((br: IBreaks) => (
                  <option key={br.id} value={br.id}>
                    {br.name} ({br.startTime} - {br.endTime})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-slate-500 my-2 relative flex items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400">
              {t("common.or", "or")}
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          <div className="flex justify-center">
            <CreateNewBreakBtn />
          </div>
        </div>
      )}

      {/* This is the new error display for the submission action */}
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
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>
        </Dialog.Close>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm"
          onClick={handleSubmit}
          disabled={assignLoading || !selectedBreakId}
        >
          {assignLoading ? t("common.saving") : t("common.save")}
        </button>
      </div>

      <Dialog.Close asChild>
        <button
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={t("common.closeDialog")}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </Dialog.Close>
    </>
  );
};

const AssignBreakDialogBtn: React.FC<AssignBreakDialogBtnProps> = ({
  shiftId,
  onAssignmentSuccess,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 text-sm flex items-center gap-2 shadow hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
          <PlusIcon className="h-5 w-5" />
          {t("assignBreakDialog.assignButton")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-50">
          {isOpen && (
            <DialogContent
              shiftId={shiftId}
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
