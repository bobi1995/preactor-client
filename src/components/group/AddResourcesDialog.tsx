import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IGroup } from "../../graphql/interfaces";
import { useAllResourcesForGroup } from "../../graphql/hook/resource";
import { useAddResourcesToGroup } from "../../graphql/hook/group";
import { toast } from "react-toastify";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";
import { X, UserPlus } from "lucide-react";

interface AddResourcesDialogProps {
  group: IGroup;
  children: React.ReactNode;
}

const AddResourcesDialog: React.FC<AddResourcesDialogProps> = ({
  group,
  children,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const { loadResources, resources, loading } = useAllResourcesForGroup();
  const { addResourcesToGroup, loading: addingResources } =
    useAddResourcesToGroup();

  useEffect(() => {
    if (isOpen) {
      loadResources();
      setSelectedResources([]);
    }
  }, [isOpen, loadResources]);

  const handleToggleResource = (resourceId: string) => {
    setSelectedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleToggleAll = () => {
    if (selectedResources.length === resources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources(resources.map((r: any) => r.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedResources.length === 0) {
      toast.warning(t("groupsPage.addResourcesDialog.noResourcesSelected"));
      return;
    }

    try {
      await addResourcesToGroup(group.id, selectedResources);
      toast.success(
        t("groupsPage.addResourcesDialog.successMessage", {
          count: selectedResources.length,
          groupName: group.name,
        })
      );
      setIsOpen(false);
      setSelectedResources([]);
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl max-h-[80vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-2 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-indigo-600" />
            {t("groupsPage.addResourcesDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            {t("groupsPage.addResourcesDialog.description", {
              groupName: group.name,
            })}
          </Dialog.Description>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-500">{t("common.loading")}</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {t("groupsPage.addResourcesDialog.noAvailableResources")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center justify-between border-b pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedResources.length === resources.length}
                    onChange={handleToggleAll}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {t("groupsPage.addResourcesDialog.selectAll")} (
                    {resources.length})
                  </span>
                </label>
                {selectedResources.length > 0 && (
                  <span className="text-sm text-indigo-600 font-medium">
                    {t("groupsPage.addResourcesDialog.selectedCount", {
                      count: selectedResources.length,
                    })}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {resources.map((resource: any) => (
                  <label
                    key={resource.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource.id)}
                      onChange={() => handleToggleResource(resource.id)}
                      className="w-4 h-4 mt-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {resource.name}
                      </div>
                      {resource.description && (
                        <div className="text-sm text-gray-500 mt-0.5">
                          {resource.description}
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={addingResources}
                  >
                    {t("common.cancel")}
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={addingResources || selectedResources.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingResources
                    ? t("common.saving")
                    : t("groupsPage.addResourcesDialog.addButton")}
                </button>
              </div>
            </form>
          )}

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

export default AddResourcesDialog;
