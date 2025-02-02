import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";
// @ts-ignore
import "@wojtekmaj/react-timerange-picker/dist/TimeRangePicker.css";
// @ts-ignore
import "react-clock/dist/Clock.css";
import { useCreateShift } from "../../graphql/hook/shift";

interface CreateShiftDialogBtnProps {
  t: (key: string, options?: any) => string;
}

type ValuePiece = Date | string | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CreateShiftDialogBtn: React.FC<CreateShiftDialogBtnProps> = ({ t }) => {
  const navigate = useNavigate();
  const { createShift, loading } = useCreateShift();
  const [name, setName] = useState("");

  const [value, onChange] = useState<Value>(["10:00", "11:00"]);

  const handleSubmit = async () => {
    if (Array.isArray(value) && value.length === 2) {
      const [startTime, endTime] = value;
      if (typeof startTime === "string" && typeof endTime === "string") {
        const shift = await createShift(name, startTime, endTime);
        navigate(`/shift/${shift.id}`);
      } else {
        throw new Error("Start time or end time is not a string");
      }
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-green-600 text-white rounded-md px-5 w-36 flex justify-center items-center gap-2">
          <PlusCircleIcon className="h-6 w-6" />
          {t("create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg max-w-2xl w-full p-6">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {t("create_shift")}
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-gray-600">
            {t("create_shift_info")}
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
                className="border rounded-md p-2 flex-1 w-full"
                type="text"
                id="name"
                placeholder={t("enter_name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">
                {t("shift_time_range")}
              </label>
              <TimeRangePicker onChange={onChange} value={value} />
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
              <XMarkIcon color="red" width={30} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateShiftDialogBtn;
