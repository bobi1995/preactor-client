import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAssignMassiveAlternativeShiftToResource } from "../../graphql/hook/resource";
import ResourcesSelect from "./MassShiftDialog/ResourcesSelect";
import ShiftSelect from "./MassShiftDialog/ShiftSelect";

interface MassShiftDialogProps {
  t: (key: string, options?: any) => string;
}

const MassShiftDialog: React.FC<MassShiftDialogProps> = ({ t }) => {
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const { assignMassiveAlternativeShift, loading: assign_loading } =
    useAssignMassiveAlternativeShiftToResource();

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleSubmit = async () => {
    if (!selectedShift) return;
    const startDateTimestamp = Math.floor(
      new Date(`${startDate}T00:00:00`).getTime() / 1000
    ).toString();
    const endDateTimestamp = Math.floor(
      new Date(`${endDate}T23:59:59`).getTime() / 1000
    ).toString();
    await assignMassiveAlternativeShift(
      selectedResources,
      selectedShift,
      startDateTimestamp,
      endDateTimestamp
    );

    window.location.reload();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-blue-600 text-white rounded-md px-5 w-36 flex justify-center items-center gap-2">
          {t("mass_shift")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg max-w-2xl w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {t("create_mass_shift")}
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-gray-600">
            {t("create_mass_shift_info")}
          </Dialog.Description>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div className="flex flex-col items-center p-8">
              <h1 className="text-2xl font-semibold mb-4">
                {t("shift_time_range")}
              </h1>
              <div className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block font-medium text-gray-700 mb-2"
                  >
                    {t("start")}
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block font-medium text-gray-700 mb-2"
                  >
                    {t("end")}
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            <ShiftSelect
              selectedShift={selectedShift}
              setSelectedShift={setSelectedShift}
              t={t}
            />
            <ResourcesSelect
              selectedResources={selectedResources}
              setSelectedResources={setSelectedResources}
              t={t}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              className="bg-blue-600 text-white rounded-md px-4 py-2"
              onClick={handleSubmit}
            >
              {t("save")}
            </button>
            <Dialog.Close asChild>
              <button className="bg-gray-200 text-gray-600 rounded-md px-4 py-2 hover:bg-gray-300">
                {t("cancel")}
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button
              disabled={assign_loading}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <XMarkIcon color="red" width={30} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MassShiftDialog;
