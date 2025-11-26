import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IAttribute } from "../../graphql/interfaces";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useDeleteAttribute } from "../../graphql/hook/attribute";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";

interface Props {
  attribute: IAttribute;
}

const DeleteAttributeDialog: React.FC<Props> = ({ attribute }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { deleteAttribute, loading, error } = useDeleteAttribute();

  const handleDelete = async () => {
    try {
      const result = await deleteAttribute(attribute.id);
      if (result) {
        setIsOpen(false);
        toast.success(t("attributesPage.deleteToast"));
      }
    } catch (err) {
      console.error("Failed to delete attribute:", err);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={t("common.delete")}
          className="p-1 rounded-full hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-gray-500 hover:text-red-600" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-50 animate-in zoom-in-95">
          <Dialog.Title className="text-lg font-semibold">
            {t("attributesPage.deleteDialog.title", "Delete Attribute")}
          </Dialog.Title>

          {loading ? (
            <div className="flex justify-center my-6">
              <InfinitySpin width="100" color="#4f46e5" />
            </div>
          ) : (
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {t("attributesPage.deleteDialog.description", {
                name: attribute.name,
                defaultValue: `Are you sure you want to delete "${attribute.name}"? This action cannot be undone.`,
              })}
            </Dialog.Description>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
export default DeleteAttributeDialog;
