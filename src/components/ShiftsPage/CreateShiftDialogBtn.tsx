import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X } from "lucide-react";
import { useCreateShift } from "../../graphql/hook/shift";
import { useTranslation } from "react-i18next";
import { ShiftForm } from "./ShiftForm";
import { IShift } from "../../graphql/interfaces";
import { toast } from "react-toastify";
import UnsavedChangesDialog from "../general/UnsavedChangesDialog";

const ERROR_CODE_MAP: { [key: string]: string } = {
  BAD_USER_INPUT: "erros.errorDuplicate",
  INTERNAL_SERVER_ERROR: "errors.errorGeneral",
};

interface CreateShiftDialogBtnProps {
  allShifts: IShift[];
}

const CreateShiftDialogBtn: React.FC<CreateShiftDialogBtnProps> = ({
  allShifts = [],
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useTranslation();
  const { createShift, loading } = useCreateShift();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreate = async (details: {
    name: string;
    startHour: string;
    endHour: string;
  }) => {
    try {
      await createShift(details.name, details.startHour, details.endHour);
      toast.success(
        t("shiftPage.toastMessage.createSuccess", { shiftName: details.name })
      );
      setIsDialogOpen(false);
    } catch (e: any) {
      const translationKey = ERROR_CODE_MAP[e.message] || "errors.errorGeneral";
      toast.error(t(translationKey));
    }
  };
  const handleAttemptClose = () => {
    if (isDirty) {
      setShowConfirm(true); // If form has changes, show the confirmation dialog
    } else {
      setIsDialogOpen(false); // Otherwise, close normally
    }
  };
  return (
    <>
      <Dialog.Root
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) handleAttemptClose();
          else setIsDialogOpen(true);
        }}
      >
        <Dialog.Trigger asChild>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md">
            <PlusCircle size={18} />
            {t("common.create")}
          </button>
        </Dialog.Trigger>
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
              {t("createShiftDialog.title")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {t("createShiftDialog.description")}
            </Dialog.Description>
            <div className="mt-4">
              <ShiftForm
                onSubmit={handleCreate}
                allShifts={allShifts}
                onDirtyChange={setIsDirty}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              {/* Cancel Button (Secondary Action) */}
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleAttemptClose}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50"
                >
                  {t("common.cancel")}
                </button>
              </Dialog.Close>

              {/* Save Button (Primary Action) */}
              <button
                type="submit"
                form="shift-form" // or "edit-shift-form"
                disabled={loading}
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
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};

export default CreateShiftDialogBtn;
