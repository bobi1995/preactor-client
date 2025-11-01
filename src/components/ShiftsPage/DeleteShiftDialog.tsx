import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangleIcon, Trash2, XIcon } from "lucide-react";
import { useDeleteShift } from "../../graphql/hook/shift";
import LoadingDialog from "../general/LoadingDialog";
import { toast } from "react-toastify";

const ERROR_CODE_MAP: { [key: string]: string } = {
  SHIFT_IN_USE_BY_RESOURCE: "deleteShiftErrors.inUseByResource",
  SHIFT_IN_USE_BY_SCHEDULE: "deleteShiftErrors.inUseBySchedule",
  SHIFT_IN_USE_BY_ALTERNATIVE: "deleteShiftErrors.inUseByAlternative",
  NOT_FOUND: "deleteShiftErrors.notFound",
  INTERNAL_SERVER_ERROR: "errors.errorGeneral",
};

const ERROR_CODE_TO_TRANSLATION_KEY: { [key: string]: string } = {
  SHIFT_IN_USE_BY_RESOURCE: "deleteShiftErrors.inUseByResource",
  SHIFT_IN_USE_BY_SCHEDULE: "deleteShiftErrors.inUseBySchedule",
  SHIFT_IN_USE_BY_ALTERNATIVE: "deleteShiftErrors.inUseByAlternative",
  NOT_FOUND: "deleteShiftErrors.notFound",
  INTERNAL_SERVER_ERROR: "deleteShiftErrors.internal",
};

interface DeleteShiftDialogProps {
  shiftId: number;
  shiftName: string;
}

const DeleteShiftDialog: React.FC<DeleteShiftDialogProps> = ({
  shiftId,
  shiftName,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { deleteShift, loading: isDeleting } = useDeleteShift();

  const handleDelete = async () => {
    setErrorMessage(null);
    try {
      deleteShift(shiftId.toString());
      toast.success(t("shiftPage.toastMessage.deleteSuccess", { shiftName }));
    } catch (error: any) {
      const errorCode = error.message;
      const translationKey =
        ERROR_CODE_TO_TRANSLATION_KEY[errorCode] || "deleteShiftErrors.unknown";
      setErrorMessage(t(translationKey));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={t("shiftTable.deleteShift", "Delete Shift")}
          className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50 focus:outline-none">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            {t("deleteShiftDialog.title", "Delete Shift")}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            {t(
              "deleteShiftDialog.description",
              `Are you sure you want to permanently delete the shift "{{shiftName}}"? This action cannot be undone.`,
              { shiftName }
            )}
          </Dialog.Description>

          {errorMessage && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangleIcon
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isDeleting ? (
            <LoadingDialog isLoading={isDeleting} />
          ) : (
            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  {t("common.cancel", "Cancel")}
                </button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {t("common.delete", "Delete")}
              </button>
            </div>
          )}
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeleteShiftDialog;
