// src/components/schedulesPage/EditScheduleDialog.tsx

import React, { useState, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { ISchedule } from "../../graphql/interfaces";
import { useUpdateSchedule } from "../../graphql/hook/schedule";
import { toast } from "react-toastify";
import { Pencil, X, LoaderCircle } from "lucide-react";
import UnsavedChangesDialog from "../general/UnsavedChangesDialog";
import ValidationError from "../general/ValidationError"; // 1. Импортираме ValidationError
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";

interface EditScheduleDialogProps {
  schedule: ISchedule;
  allSchedules?: ISchedule[];
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  schedule,
  allSchedules = [],
  onSuccess,
  children,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(schedule.name);
  const { updateSchedule, loading } = useUpdateSchedule();
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  const handleClearServerError = useCallback(() => {
    setServerError(null);
  }, []);

  useEffect(() => {
    if (serverError) {
      setValidationError({ message: serverError, key: Date.now() });
    }
  }, [serverError]);

  useEffect(() => {
    if (isOpen) {
      setName(schedule.name);
      setIsDirty(false);
      setValidationError(null);
      setServerError(null);
    }
  }, [isOpen, schedule.name]);

  useEffect(() => {
    if (isOpen) {
      const dirty = name.trim() !== schedule.name;
      setIsDirty(dirty);
      if (dirty) {
        setValidationError(null);
        handleClearServerError();
      }
    }
  }, [name, schedule.name, isOpen, handleClearServerError]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    setServerError(null);

    const trimmedName = name.trim();

    if (
      allSchedules.length > 0 &&
      allSchedules.some(
        (s) =>
          s.id !== schedule.id &&
          s.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      triggerError("schedulesPage.nameExistsError");
      return;
    }

    if (trimmedName === "") {
      triggerError("common.nameRequired");
      return;
    }

    if (trimmedName === "") {
      triggerError("common.nameRequired");
      return;
    }

    if (isDirty) {
      try {
        await updateSchedule(schedule.id, { name: trimmedName });
        toast.success(t("schedulesPage.updateSuccess"));
        onSuccess?.();
        setIsOpen(false);
      } catch (e: any) {
        const translationKey =
          ERROR_CODE_TO_TRANSLATION_KEY[e.message] || "errors.errorGeneral";
        setServerError(t(translationKey));
      }
    } else {
      setIsOpen(false);
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
          else setIsOpen(true);
        }}
      >
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
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
              {t("schedulesPage.editDialogTitle")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {t("schedulesPage.editDialogDescription", {
                scheduleName: schedule.name,
              })}
            </Dialog.Description>
            <form onSubmit={handleUpdate} className="mt-4">
              <div>
                <label
                  htmlFor={`schedule-name-${schedule.id}`}
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("schedulesPage.nameLabel")}
                </label>
                <input
                  id={`schedule-name-${schedule.id}`}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  required
                />
              </div>

              {/* 4. Добавяме място за показване на грешката */}
              <div className="mt-2 min-h-[20px]">
                <ValidationError error={validationError} />
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleAttemptClose}
                  className="px-4 py-2 bg-slate-100 rounded-md"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={loading || !isDirty} // 5. Бутонът вече се управлява от isDirty
                  className="disabled:bg-indigo-400 disabled:cursor-not-allowed inline-flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-md"
                >
                  {loading && (
                    <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  )}
                  {loading ? t("common.saving") : t("common.saveChanges")}
                </button>
              </div>
            </form>
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4"
                aria-label="Close"
                onClick={handleAttemptClose}
              >
                <X className="h-5 w-5 text-gray-500" />
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

export default EditScheduleDialog;
