import React, { useState, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IResource, ISchedule } from "../../graphql/interfaces";
import {
  GET_SCHEDULES,
  GET_SCHEDULES_MINIMAL,
} from "../../graphql/query/schedule";
import { useUpdateResource } from "../../graphql/hook/resource"; // Assuming hooks are in this file
import { useLazyQuery } from "@apollo/client"; // Import for lazy loading
import { toast } from "react-toastify";
import { X, LoaderCircle } from "lucide-react";
import UnsavedChangesDialog from "../general/UnsavedChangesDialog";
import ValidationError from "../general/ValidationError";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";

interface EditResourceDialogProps {
  resource: IResource;
  allResources: IResource[]; // For client-side unique name check
  onSuccess?: () => void;
  children: React.ReactNode; // Use children for the trigger
}

// Helper: Define initial state from the resource prop
const getInitialState = (resource: IResource) => ({
  name: resource.name || "",
  description: resource.description || "",
  color: resource.color || "#ffffff", // Default to white if null
  externalCode: resource.externalCode || "",
  scheduleId: resource.schedule?.id ? String(resource.schedule.id) : "null",
});

const EditResourceDialog: React.FC<EditResourceDialogProps> = ({
  resource,
  allResources,
  onSuccess,
  children,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(getInitialState(resource));
  const { updateResource, loading: updateLoading } = useUpdateResource();
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);

  // --- Lazy Loading for Schedules ---
  const [loadSchedules, { data: schedulesData, loading: schedulesLoading }] =
    useLazyQuery(GET_SCHEDULES_MINIMAL, {
      fetchPolicy: "network-only",
    });
  const schedules: ISchedule[] = schedulesData?.schedules || [];

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialState(resource));
      setIsDirty(false);
      setValidationError(null);
      // This is the trigger you requested:
      // Load schedules when dialog opens
      loadSchedules();
      console.log("EditResourceDialog opened for resource:", resource.id);
    }
  }, [isOpen, resource, loadSchedules]);

  // Track if form is "dirty" (changed)
  useEffect(() => {
    if (isOpen) {
      const initialState = getInitialState(resource);
      const dirty =
        formData.name.trim() !== initialState.name ||
        formData.description.trim() !== initialState.description ||
        formData.color.trim() !== initialState.color ||
        formData.externalCode.trim() !== initialState.externalCode ||
        formData.scheduleId !== initialState.scheduleId;
      setIsDirty(dirty);
      if (dirty) {
        setValidationError(null); // Clear errors when user starts typing
      }
    }
  }, [formData, resource, isOpen]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    const trimmedName = formData.name.trim();

    // --- Client-side Validation ---
    if (trimmedName === "") {
      triggerError("common.nameRequired");
      return;
    }

    if (
      allResources.some(
        (r) =>
          r.id !== resource.id &&
          r.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      triggerError("resourcePage.editDialog.nameExistsError"); // Add this key
      return;
    }
    // ---

    if (isDirty) {
      try {
        // Construct the input object for the mutation
        const input = {
          id: parseInt(resource.id),
          name: trimmedName,
          description: formData.description.trim(),
          color: formData.color.trim(),
          externalCode: formData.externalCode.trim(),
          // The server resolver (mapInputToData) handles string->int conversion
          scheduleId:
            formData.scheduleId === "null"
              ? undefined
              : parseInt(formData.scheduleId),
        };

        await updateResource(input); // Assumes hook takes one 'input' object
        toast.success(
          t("resourcePage.editDialog.updateSuccess", {
            resourceName: trimmedName,
          })
        ); // Add this key
        onSuccess?.();
        setIsOpen(false);
      } catch (e: any) {
        const translationKey =
          ERROR_CODE_TO_TRANSLATION_KEY[e.message] || "errors.errorGeneral";
        setValidationError({ message: t(translationKey), key: Date.now() });
      }
    } else {
      setIsOpen(false); // No changes, just close
    }
  };

  const handleAttemptClose = useCallback(() => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      setIsOpen(false);
    }
  }, [isDirty]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  console.log(schedules);

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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50 data-[state=open]:animate-contentShow"
          >
            <Dialog.Title className="text-xl font-semibold">
              {t("resourcePage.editDialog.title")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              {t("resourcePage.editDialog.description", {
                resourceName: resource.name,
              })}
            </Dialog.Description>
            <form onSubmit={handleUpdate} className="mt-4 space-y-4">
              {/* Name */}
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  required
                />
              </div>

              {/* Description */}
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                />
              </div>

              <div className="flex gap-4">
                {/* External Code */}
                <div className="flex-1">
                  <label
                    htmlFor="externalCode"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t(
                      "resourcePage.editDialog.externalCodeLabel",
                      "External Code"
                    )}
                  </label>
                  <input
                    id="externalCode"
                    type="text"
                    placeholder={t(
                      "resourcePage.editDialog.externalCodePlaceholder",
                      "e.g. EXT-12345"
                    )}
                    value={formData.externalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  />
                </div>
                {/* Color */}
                <div className="w-24">
                  <label
                    htmlFor="color"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("resourcePage.editDialog.colorLabel", "Color")}
                  </label>
                  <input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full h-10 px-1 py-1 border border-slate-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              {/* Schedule Select */}
              <div>
                <label
                  htmlFor="scheduleId"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("common.schedule")}
                </label>
                <select
                  id="scheduleId"
                  value={formData.scheduleId}
                  onChange={handleChange}
                  disabled={schedulesLoading}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                >
                  {schedulesLoading ? (
                    <option>{t("common.loading", "Loading...")}</option>
                  ) : (
                    <>
                      <option value="null">
                        --
                        {t("resourcePage.editDialog.noSchedule", "No Schedule")}
                        --
                      </option>
                      {schedules.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="mt-2 min-h-[20px]">
                <ValidationError error={validationError} />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleAttemptClose}
                  className="px-4 py-2 bg-slate-100 rounded-md"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={updateLoading || !isDirty}
                  className="disabled:bg-indigo-400 disabled:cursor-not-allowed inline-flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-md"
                >
                  {updateLoading && (
                    <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  )}
                  {updateLoading ? t("common.saving") : t("common.saveChanges")}
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

      {/* Unsaved Changes Confirmation */}
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

export default EditResourceDialog;
