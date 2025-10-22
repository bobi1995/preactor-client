// src/components/ShiftsPage/EditShiftDialog.tsx

import React, { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import { useUpdateShift } from "../../graphql/hook/shift";
import { ShiftForm } from "./ShiftForm";
import { XIcon } from "lucide-react";
import { toast } from "react-toastify";
import UnsavedChangesDialog from "../general/UnsavedChangesDialog";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";

interface EditShiftDialogProps {
  children: React.ReactNode;
  shift: IShift;
  onSuccess?: () => void;
  allShifts?: IShift[];
}

const EditShiftDialog: React.FC<EditShiftDialogProps> = ({
  children,
  shift,
  onSuccess,
  allShifts = [],
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { updateShift, loading, error } = useUpdateShift();
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleClearServerError = useCallback(() => {
    setServerError(null);
  }, []);

  const handleUpdate = async (details: {
    name: string;
    startHour: string;
    endHour: string;
  }) => {
    setServerError(null);
    try {
      await updateShift(shift.id.toString(), details);
      toast.success(
        t("shiftPage.toastMessage.updateSuccess", { shiftName: details.name })
      );
      onSuccess?.();
      setIsOpen(false);
    } catch (e: any) {
      let errorCode = "INTERNAL_SERVER_ERROR";
      if (e.graphQLErrors && e.graphQLErrors.length > 0) {
        errorCode = e.graphQLErrors[0].extensions?.code || errorCode;
      }
      const translationKey =
        ERROR_CODE_TO_TRANSLATION_KEY[errorCode] || "common.errorGeneral";
      setServerError(t(translationKey));
    }
  };

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      setIsOpen(false);
    }
  }, [isDirty]);

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleAttemptClose();
          else {
            setIsOpen(true);
            setServerError(null); // Clear server error on dialog open
          }
        }}
      >
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
          <Dialog.Content
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              handleAttemptClose();
            }}
            onPointerDownOutside={(e) => {
              e.preventDefault();
              handleAttemptClose();
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50"
          >
            <Dialog.Title className="text-xl font-semibold">
              {t("editShiftDialog.title")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {t("editShiftDialog.description")}
            </Dialog.Description>

            <div className="mt-4">
              <ShiftForm
                initialData={shift}
                onSubmit={handleUpdate}
                allShifts={allShifts}
                onDirtyChange={setIsDirty}
                serverError={serverError} // Pass the translated server error message
                onClearServerError={handleClearServerError}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleAttemptClose}
                  className="px-4 py-2 text-sm text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50"
                >
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                form="shift-form"
                disabled={loading || !isDirty}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t("common.saving") : t("common.save")}
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                onClick={handleAttemptClose}
                className="absolute top-4 right-4"
              >
                <XIcon className="h-5 w-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <UnsavedChangesDialog
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default EditShiftDialog;
