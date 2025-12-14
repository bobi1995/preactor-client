import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateAttribute } from "../../graphql/hook/attribute"; // Hook to be created
import { IAttribute } from "../../graphql/interfaces";
import { toast } from "react-toastify";
import ValidationError from "../general/ValidationError";

interface Props {
  allAttributes: IAttribute[];
}

const CreateAttributeDialog: React.FC<Props> = ({ allAttributes }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { createAttribute, loading } = useCreateAttribute();
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  const resetForm = () => {
    setName("");
    setValidationError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    if (name.trim() === "") {
      triggerError("common.nameRequired");
      return;
    }

    if (
      allAttributes.some(
        (a) => a.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      triggerError("attributesPage.nameExistsError");
      return;
    }

    try {
      await createAttribute(name);
      setIsDialogOpen(false);
      toast.success(t("attributesPage.createToast"));
    } catch (err) {
      console.error("Error creating attribute:", err);
      triggerError("errors.errorGeneral");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) resetForm();
    setIsDialogOpen(open);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md">
          <PlusCircle className="h-5 w-5" />
          {t("common.create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50 animate-in zoom-in-95">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("attributesPage.createDialog.title", "Create Attribute")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t(
              "attributesPage.createDialog.description",
              "Add a new attribute type (e.g. Color, Thickness)."
            )}
          </Dialog.Description>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="attr-name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("attributesPage.createDialog.nameLabel", "Name")}
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  type="text"
                  id="attr-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Color"
                  required
                />
              </div>
            </div>

            <ValidationError error={validationError} />

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                disabled={loading || !name.trim()}
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {t("common.save")}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateAttributeDialog;
