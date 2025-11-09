import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router";
import { useCreateGroup } from "../../graphql/hook/group";
import { XIcon, PlusCircle } from "lucide-react";
import { IGroup } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface CreateGroupBtnProps {
  allGroups: IGroup[];
}

const CreateGroupBtn: React.FC<CreateGroupBtnProps> = ({ allGroups }) => {
  const { t } = useTranslation();
  const { createGroup, loading } = useCreateGroup();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    // Check for duplicate names
    const isDuplicate = allGroups.some(
      (g) => g.name.toLowerCase() === formData.name.toLowerCase()
    );

    if (isDuplicate) {
      toast.error(t("groupsPage.createDialog.nameExistsError"));
      return;
    }

    try {
      const group = await createGroup(formData.name, formData.description);
      toast.success(
        t("groupsPage.createDialog.createSuccess", { groupName: formData.name })
      );
      setIsOpen(false);
      navigate(`/group/${group.id}`);
    } catch (error) {
      toast.error(t("errors.errorGeneral"));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-green-600 text-white rounded-md px-5 w-36 flex justify-center items-center gap-2 uppercase">
          <PlusCircle className="h-6 w-6" />
          {t("common.create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg max-w-lg w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {t("groupsPage.createDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-gray-600">
            {t("groupsPage.createDialog.description")}
          </Dialog.Description>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {/* Name Input */}
            <div className="flex items-center gap-3">
              <label className="w-20" htmlFor="name">
                {t("common.name")}
              </label>
              <input
                className="border rounded-md p-2 flex-1"
                type="text"
                id="name"
                placeholder={t("groupsPage.createDialog.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description Input */}
            <div className="flex items-center gap-3">
              <label className="w-20" htmlFor="description">
                {t("common.description")}
              </label>
              <input
                className="border rounded-md p-2 flex-1"
                type="text"
                id="description"
                placeholder={t(
                  "groupsPage.createDialog.descriptionPlaceholder"
                )}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              className="bg-blue-600 text-white rounded-md px-4 py-2"
              onClick={handleSubmit}
              disabled={loading}
            >
              {t("common.save")}
            </button>
            <Dialog.Close asChild>
              <button
                disabled={loading}
                className="bg-gray-200 text-gray-600 rounded-md px-4 py-2 hover:bg-gray-300"
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <XIcon color="red" width={30} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateGroupBtn;
