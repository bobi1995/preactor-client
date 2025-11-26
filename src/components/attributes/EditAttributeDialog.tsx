import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IAttribute } from "../../graphql/interfaces";
import { Pencil, X, LoaderCircle } from "lucide-react";
import { useUpdateAttribute } from "../../graphql/hook/attribute";
import { toast } from "react-toastify";
import ValidationError from "../general/ValidationError";
import UnsavedChangesDialog from "../general/UnsavedChangesDialog";

interface Props {
  attribute: IAttribute;
  allAttributes: IAttribute[];
}

const EditAttributeDialog: React.FC<Props> = ({ attribute, allAttributes }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { updateAttribute, loading, error: serverError } = useUpdateAttribute();

  useEffect(() => {
    if (isOpen) {
      setName(attribute.name);
      setIsDirty(false);
      setValidationError(null);
    }
  }, [isOpen, attribute]);

  useEffect(() => {
    setIsDirty(name.trim() !== attribute.name);
  }, [name, attribute]);

  const handleAttemptClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    if (
      allAttributes.some(
        (a) =>
          a.id !== attribute.id &&
          a.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setValidationError({
        message: t("attributesPage.nameExistsError"),
        key: Date.now(),
      });
      return;
    }

    try {
      await updateAttribute(attribute.id, trimmedName);
      toast.success(t("attributesPage.editToast"));
      setIsDirty(false);
      setIsOpen(false);
    } catch (e) {
      // serverError handled in render
    }
  };

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleAttemptClose();
          else setIsOpen(true);
        }}
      >
        <Dialog.Trigger asChild>
          <button
            title={t("common.edit")}
            className="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-100 transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/40 fixed inset-0 z-40 animate-in fade-in" />
          <Dialog.Content
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              handleAttemptClose();
            }}
            onPointerDownOutside={(e) => {
              e.preventDefault();
              handleAttemptClose();
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50 animate-in zoom-in-95"
          >
            <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
              {t("attributesPage.editDialog.title", "Edit Attribute")}
            </Dialog.Title>
            <Dialog.Description className="mb-5 text-sm text-slate-500">
              {t(
                "attributesPage.editDialog.description",
                "Update the attribute name."
              )}
            </Dialog.Description>

            <form id="edit-attr-form" onSubmit={handleUpdate}>
              <div>
                <label
                  htmlFor="attr-name-edit"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("attributesPage.createDialog.nameLabel", "Name")}
                </label>
                <input
                  id="attr-name-edit"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4 min-h-[20px]">
                <ValidationError error={validationError} />
                {serverError && (
                  <p className="text-sm text-red-600">{serverError.message}</p>
                )}
              </div>
            </form>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleAttemptClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                form="edit-attr-form"
                disabled={loading || !isDirty}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {t("common.saveChanges")}
              </button>
            </div>

            <Dialog.Close asChild>
              <button
                onClick={handleAttemptClose}
                className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
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

export default EditAttributeDialog;
