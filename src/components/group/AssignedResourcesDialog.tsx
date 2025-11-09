import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IGroup } from "../../graphql/interfaces";
import { X, Users, Trash2 } from "lucide-react";
import AddResourcesDialog from "./AddResourcesDialog";
import {
  useRemoveResourceFromGroup,
  useRemoveAllResourcesFromGroup,
} from "../../graphql/hook/group";
import { toast } from "react-toastify";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";
import ConfirmationDialog from "../general/ConfirmDialog";

interface AssignedResourcesDialogProps {
  group: IGroup;
  children: React.ReactNode;
}

const AssignedResourcesDialog: React.FC<AssignedResourcesDialogProps> = ({
  group,
  children,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { removeResourceFromGroup } = useRemoveResourceFromGroup();
  const { removeAllResourcesFromGroup } = useRemoveAllResourcesFromGroup();
  const resources = group.resourceLinks?.map((link) => link.resource) || [];

  const handleRemoveResource = async (
    resourceId: string,
    resourceName: string
  ) => {
    setRemovingId(resourceId);
    try {
      await removeResourceFromGroup(group.id, resourceId);
      toast.success(
        t("groupsPage.assignedResourcesDialog.removeSuccess", {
          resourceName,
          groupName: group.name,
        })
      );
    } catch (e: any) {
      const translationKey =
        ERROR_CODE_TO_TRANSLATION_KEY[e.message] || "errors.errorGeneral";
      toast.error(t(translationKey));
    } finally {
      setRemovingId(null);
    }
  };

  const handleRemoveAll = async () => {
    try {
      await removeAllResourcesFromGroup(group.id);
      toast.success(
        t("groupsPage.assignedResourcesDialog.removeAllSuccess", {
          groupName: group.name,
        })
      );
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl h-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl flex flex-col">
          {/* Header Section */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    {t("groupsPage.assignedResourcesDialog.title")}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-600 mt-0.5">
                    {t("groupsPage.assignedResourcesDialog.description", {
                      groupName: group.name,
                    })}
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close asChild>
                <button
                  className="rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
            {resources.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-gray-100 rounded-full mb-4">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-1">
                  {t("groupsPage.assignedResourcesDialog.noResources")}
                </p>
                <p className="text-sm text-gray-500">
                  {t("groupsPage.assignedResourcesDialog.addResourcesHint")}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        {t("common.name")}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        {t("common.description")}
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                        {t("resourceTable.externalCode")}
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
                        {t("common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {resources.map((resource) => (
                      <tr
                        key={resource.id}
                        className="hover:bg-indigo-50/50 transition-colors"
                      >
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {resource.color && (
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: resource.color }}
                              />
                            )}
                            <span className="text-base font-medium text-indigo-700">
                              {resource.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700 whitespace-normal break-words">
                          {resource.description || (
                            <span className="italic text-gray-400 text-xs">
                              {t("resourceTable.noDescriptionProvided")}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          {resource.externalCode ? (
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {resource.externalCode}
                            </span>
                          ) : (
                            <span className="italic text-gray-400 text-xs">
                              {t("resourceTable.noExternalCode")}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          <button
                            onClick={() =>
                              handleRemoveResource(resource.id, resource.name)
                            }
                            disabled={removingId !== null}
                            title={t(
                              "groupsPage.assignedResourcesDialog.removeResource"
                            )}
                            className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {removingId === resource.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {resources.length}{" "}
                    {resources.length === 1
                      ? t("groupsPage.assignedResourcesDialog.resourceSingular")
                      : t("groupsPage.assignedResourcesDialog.resourcePlural")}
                  </span>
                </div>
                {resources.length > 0 && (
                  <ConfirmationDialog
                    triggerButton={
                      <button
                        disabled={removingId !== null}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("groupsPage.assignedResourcesDialog.removeAll")}
                      </button>
                    }
                    title={t(
                      "groupsPage.assignedResourcesDialog.removeAllConfirmTitle"
                    )}
                    description={t(
                      "groupsPage.assignedResourcesDialog.removeAllConfirmDescription",
                      {
                        count: resources.length,
                        groupName: group.name,
                      }
                    )}
                    confirmAction={handleRemoveAll}
                    confirmText={t(
                      "groupsPage.assignedResourcesDialog.removeAll"
                    )}
                  />
                )}
              </div>
              <div className="flex gap-3">
                <AddResourcesDialog group={group}>
                  <button className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                    {t("groupsPage.addResourcesDialog.triggerTitle")}
                  </button>
                </AddResourcesDialog>
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    {t("common.close")}
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AssignedResourcesDialog;
