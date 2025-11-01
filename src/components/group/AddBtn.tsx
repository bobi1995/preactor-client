import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAddResourcesToGroup } from "../../graphql/hook/group";
import ResourcesSelect from "../schedulesPage/MassShiftDialog";
import { IResource } from "../../graphql/interfaces";
import { PlusCircle, XIcon } from "lucide-react";

interface CreateGroupBtnProps {
  t: (key: string, options?: any) => string;
  groupId: string;
  assignedResources?: IResource[];
}

const AddBtn: React.FC<CreateGroupBtnProps> = ({
  t,
  groupId,
  assignedResources,
}) => {
  const { addResourceToGroup, loading } = useAddResourcesToGroup();
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const handleSubmit = async () => {
    await addResourceToGroup(groupId, selectedResources);
    window.location.reload();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button>
          <PlusCircle className="h-6 w-6" />
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
            <ResourcesSelect t={t} />
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

export default AddBtn;
