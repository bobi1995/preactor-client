// src/components/shift/EditShiftDialog.tsx

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import { useUpdateShift } from "../../graphql/hook/shift";
import { ShiftForm } from "./ShiftForm"; // Import the reusable form
import { SquarePenIcon, XIcon } from "lucide-react";

interface EditShiftDialogProps {
  shift: IShift;
  onSuccess?: () => void;
  allShifts?: IShift[];
}

const EditShiftDialog: React.FC<EditShiftDialogProps> = ({
  shift,
  onSuccess,
  allShifts = [],
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { updateShift, loading } = useUpdateShift();

  const handleUpdate = async (details: {
    name: string;
    startHour: string;
    endHour: string;
  }) => {
    try {
      await updateShift(shift.id.toString(), details);
      if (onSuccess) {
        onSuccess();
      }
      setIsOpen(false);
    } catch (e) {
      console.error("Error updating shift:", e);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={t("shiftTable.editShift")}
          className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-100"
        >
          <SquarePenIcon className="w-5 h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50">
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
            />
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <button className="absolute top-4 right-4">
              <XIcon className="h-5 w-5 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditShiftDialog;
