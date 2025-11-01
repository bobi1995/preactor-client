import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate } from "react-router";
import { useCreateGroup } from "../../graphql/hook/group";
import { XIcon, PlusCircle } from "lucide-react";

interface CreateGroupBtnProps {
  t: (key: string, options?: any) => string;
}

const CreateGroupBtn: React.FC<CreateGroupBtnProps> = ({ t }) => {
  const { createGroup, loading } = useCreateGroup();
  const navigate = useNavigate();
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
    const group = await createGroup(formData.name, formData.description);
    navigate(`/group/${group.id}`);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-green-600 text-white rounded-md px-5 w-36 flex justify-center items-center gap-2 uppercase">
          <PlusCircle className="h-6 w-6" />
          {t("create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg max-w-lg w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {t("create_group")}
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-gray-600">
            {t("create_group_info")}
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
                {t("name")}
              </label>
              <input
                className="border rounded-md p-2 flex-1"
                type="text"
                id="name"
                placeholder={t("enter_name")}
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Description Input */}
            <div className="flex items-center gap-3">
              <label className="w-20" htmlFor="description">
                {t("description")}
              </label>
              <input
                className="border rounded-md p-2 flex-1"
                type="text"
                id="description"
                placeholder={t("enter_desc")}
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
              {t("save")}
            </button>
            <Dialog.Close asChild>
              <button
                disabled={loading}
                className="bg-gray-200 text-gray-600 rounded-md px-4 py-2 hover:bg-gray-300"
              >
                {t("cancel")}
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
