import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next"; // Use hook internally
import { useNavigate } from "react-router";
import { useCreateResource } from "../../graphql/hook/resource";
import { toast } from "react-toastify";
import { IResource } from "../../graphql/interfaces"; // Import IResource
import ValidationError from "../general/ValidationError"; // Assume this component exists

// Error mapping from CreateScheduleDialog
const ERROR_CODE_MAP: { [key: string]: string } = {
  BAD_USER_INPUT: "errors.createErrorDuplicate", // Or a more specific resource key
  INTERNAL_SERVER_ERROR: "errors.errorGeneral",
};

// Add allResources to the props
interface CreateDialogBtnProps {
  allResources: IResource[];
}

const CreateDialogBtn: React.FC<CreateDialogBtnProps> = ({ allResources }) => {
  const { t } = useTranslation(); // Use the hook here
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { createResource, loading } = useCreateResource();

  // State for both form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    const trimmedName = formData.name.trim();

    // --- Validation ---
    if (trimmedName === "") {
      triggerError("common.nameRequired");
      return;
    }
    if (
      allResources.some(
        (r) => r.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      triggerError("resourcePage.createResourceDialog.nameExistsError");
      return;
    }

    try {
      // Pass arguments separately as expected by the hook
      const newResource = await createResource(
        trimmedName,
        formData.description.trim()
      );

      if (newResource?.id) {
        // You should add this key to your translation files
        toast.success(
          t("resourcePage.createResourceDialog.createSuccess", {
            resourceName: trimmedName,
          }) || `Resource '${trimmedName}' created successfully.`
        );
        // Navigate to the new resource
        // navigate(`/resource/${newResource.id}`);
        setIsOpen(false); // Close dialog on success
      }
    } catch (e: any) {
      const translationKey = ERROR_CODE_MAP[e.message] || "errors.errorGeneral";
      triggerError(translationKey);
    }
  };

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFormData({ name: "", description: "" });
      setValidationError(null);
    }
    setIsOpen(open);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        {/* Styled like CreateScheduleDialog trigger */}
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md">
          <PlusCircle size={18} /> {t("common.create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50">
          <Dialog.Title className="text-xl font-semibold">
            {t("resourcePage.createResourceDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            {t("resourcePage.createResourceDialog.description")}
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("common.name")}
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={t(
                  "resourcePage.createResourceDialog.namePlaceholder"
                )}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("common.description")}
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder={t(
                  "resourcePage.createResourceDialog.descriptionPlaceholder"
                )}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <ValidationError error={validationError} />

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 disabled:opacity-50"
                >
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="inline-flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {loading ? t("common.saving") : t("common.create")}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateDialogBtn;
