// src/components/breaks/DeleteBreakDialog.tsx
import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../../graphql/interfaces";
import { AlertTriangle, TrashIcon } from "lucide-react";
import { useDeleteBreak } from "../../graphql/hook/break";
import InfinityLoader from "../general/Loader";
import { InfinitySpin } from "react-loader-spinner";

interface Props {
  breakItem: IBreaks;
}

const DeleteBreakDialog: React.FC<Props> = ({ breakItem }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteBreak, loading, error } = useDeleteBreak();

  const handleDelete = async () => {
    try {
      const result = await deleteBreak(breakItem.id);
      if (result && result.success) {
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete break:", err);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={t("common.delete")}
          className="p-1 rounded-full hover:bg-red-100"
        >
          <TrashIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50">
          <Dialog.Title className="text-lg font-semibold">
            {t("breaksPage.deleteDialog.title")}
          </Dialog.Title>
          {loading ? (
            <div className="flex justify-center my-6">
              <InfinitySpin />
            </div>
          ) : (
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {t("breaksPage.deleteDialog.description", {
                breakName: breakItem.name,
              })}
            </Dialog.Description>
          )}
          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle
                    className="h-5 w-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error.message}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 bg-gray-100 rounded-md"
                disabled={loading}
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              disabled={loading}
            >
              {t("common.delete")}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default DeleteBreakDialog;
