import React from "react";
import { useTranslation } from "react-i18next";
import { IGroup } from "../../graphql/interfaces";
import ConfirmationDialog from "../general/ConfirmDialog";
import { Trash2 } from "lucide-react";
import { useDeleteGroup } from "../../graphql/hook/group";
import { toast } from "react-toastify";
import { ERROR_CODE_TO_TRANSLATION_KEY } from "../../utils/error-mapping";

interface DeleteGroupDialogProps {
  groupItem: IGroup;
}

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({ groupItem }) => {
  const { t } = useTranslation();
  const { deleteGroup } = useDeleteGroup();

  const handleDelete = async () => {
    try {
      await deleteGroup(groupItem.id);
      toast.success(
        t("groupsPage.deleteSuccess", { groupName: groupItem.name })
      );
    } catch (e: any) {
      const translationKey =
        ERROR_CODE_TO_TRANSLATION_KEY[e.message] || "errors.errorGeneral";
      toast.error(t(translationKey));
      throw e;
    }
  };

  return (
    <ConfirmationDialog
      title={t("groupsPage.deleteDialog.title")}
      description={t("groupsPage.deleteDialog.description", {
        groupName: groupItem.name,
      })}
      confirmAction={handleDelete}
      triggerButton={
        <button
          title={t("common.delete")}
          className="p-1 rounded-full text-gray-500 hover:text-red-600"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      }
    />
  );
};

export default DeleteGroupDialog;
