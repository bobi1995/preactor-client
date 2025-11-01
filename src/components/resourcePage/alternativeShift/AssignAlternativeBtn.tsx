import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useShifts } from "../../../graphql/hook/shift";
import InfinityLoader from "../../general/Loader";
import ErrorComponent from "../../general/Error";
import { IShift } from "../../../graphql/interfaces";
import { useAssignAlternativeShiftToResource } from "../../../graphql/hook/resource";
import { XIcon } from "lucide-react";

interface AssignBreakDialogBtnProps {
  t: (key: string, options?: any) => string;
  resourceId: string;
}

const AssignAlternativeBtn: React.FC<AssignBreakDialogBtnProps> = ({
  t,
  resourceId,
}) => {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { shifts, loading, error, reload } = useShifts();
  const { assignAlternativeShift, loading: assignLoading } =
    useAssignAlternativeShiftToResource();
  const [selectedShiftId, setSelectedShiftId] = useState<string>("");

  if (loading) {
    return <InfinityLoader />;
  }

  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch breaks. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }

  const handleSubmit = async () => {
    if (!selectedShiftId) return;
    const startTimestamp = Math.floor(
      new Date(startDate).getTime() / 1000
    ).toString();
    const endTimestamp = Math.floor(
      new Date(endDate).getTime() / 1000
    ).toString();

    await assignAlternativeShift(
      resourceId,
      selectedShiftId,
      startTimestamp,
      endTimestamp
    );
    window.location.reload();
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="w-36 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200">
          {t("assign_shift")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto mt-8">
          <div className="flex flex-col items-center p-8">
            <h1 className="text-2xl font-semibold mb-4">Select Date Range</h1>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block font-medium text-gray-700 mb-2"
                >
                  Start Date
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
                  End Date
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
          <div>
            <label
              htmlFor="break-select"
              className="block font-medium text-gray-700 mb-2"
            >
              {t("choose_shift")}
            </label>
            <select
              id="break-select"
              value={selectedShiftId}
              onChange={(e) => setSelectedShiftId(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- {t("choose_shift")} --
              </option>
              {shifts.map((shift: IShift) => (
                <option key={shift.id} value={shift.id}>
                  {shift.name} ({shift.startHour} - {shift.endHour})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              className="bg-blue-600 text-white rounded-md px-4 py-2"
              onClick={handleSubmit}
              disabled={loading || assignLoading}
            >
              {t("save")}
            </button>
            <Dialog.Close asChild>
              <button
                disabled={loading || assignLoading}
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

export default AssignAlternativeBtn;
