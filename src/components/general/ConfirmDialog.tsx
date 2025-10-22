import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { AlertTriangleIcon } from "lucide-react";
import Spinner from "./Spinner";

interface ConfirmationDialogProps {
  triggerButton: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  confirmAction: () => Promise<void>;
  confirmText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  triggerButton,
  title,
  description,
  confirmAction,
  confirmText,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsConfirming(true);
    setErrorMessage(null);
    try {
      await confirmAction();
      setIsOpen(false);
    } catch (error: any) {
      setErrorMessage(error.message || t("errors.errorGeneral"));
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-w-md w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50">
          <div className="flex items-start space-x-4">
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangleIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
              <div className="mt-2 text-sm text-gray-600">
                {description || <p>{t("confirmationDialog.areYouSure")}</p>}
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-4 text-center text-sm text-red-700 bg-red-50 p-3 rounded-md">
              {errorMessage}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={isConfirming}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              type="button"
              disabled={isConfirming}
              onClick={handleConfirm}
              className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto disabled:bg-red-400"
            >
              {isConfirming && (
                <Spinner className="h-4 w-4 mr-2 border-white/40 border-t-white" />
              )}
              {confirmText || t("common.delete")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmationDialog;
