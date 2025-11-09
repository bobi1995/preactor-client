import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IGroup } from "../../graphql/interfaces";
import { useUpdateGroup } from "../../graphql/hook/group";
import { toast } from "react-toastify";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";
import { X } from "lucide-react";

interface EditGroupDialogProps {
  group: IGroup;
  allGroups: IGroup[];
  children: React.ReactNode;
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({
  group,
  allGroups,
  children,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || "");
  const { updateGroup, loading } = useUpdateGroup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for duplicate names (excluding current group)
    const isDuplicate = allGroups.some(
      (g) => g.id !== group.id && g.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error(t("groupsPage.editDialog.nameExistsError"));
      return;
    }

    try {
      await updateGroup(group.id, name, description);
      toast.success(
        t("groupsPage.editDialog.updateSuccess", { groupName: name })
      );
      setIsOpen(false);
    } catch (e: any) {
      const translationKey =
        ERROR_CODE_TO_TRANSLATION_KEY[e.message] || "errors.errorGeneral";
      toast.error(t(translationKey));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl">
          <Dialog.Title className="text-xl font-semibold mb-2">
            {t("groupsPage.editDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            {t("groupsPage.editDialog.description")}
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                {t("common.name")}
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("groupsPage.editDialog.namePlaceholder")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                {t("common.description")}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("groupsPage.editDialog.descriptionPlaceholder")}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("common.saving") : t("common.save")}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditGroupDialog;
