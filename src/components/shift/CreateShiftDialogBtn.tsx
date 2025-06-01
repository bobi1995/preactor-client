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

const generateTimeOptions = (
  max: number,
  step: number = 1,
  pad: boolean = true
): string[] => {
  const options = [];
  for (let i = 0; i < max; i += step) {
    options.push(pad ? String(i).padStart(2, "0") : String(i));
  }
  return options;
};
const hourOptions = generateTimeOptions(24); // 00-23
const minuteOptions = generateTimeOptions(60, 15); // 00, 15, 30, 45

const CreateShiftDialogBtn: React.FC<CreateShiftDialogBtnProps> = ({ t }) => {
  const { createShift, loading } = useCreateShift();
  const [name, setName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startHour, setStartHour] = useState("10");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("11");
  const [endMinute, setEndMinute] = useState("00");

  const resetForm = () => {
    setName("");
    setStartHour("10");
    setStartMinute("00");
    setEndHour("11");
    setEndMinute("00");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() !== "") {
      const startTime = `${startHour}:${startMinute}`;
      const endTime = `${endHour}:${endMinute}`;

      try {
        // Basic validation: end time should be after start time
        const startDate = new Date(`1970-01-01T${startTime}:00`);
        const endDate = new Date(`1970-01-01T${endTime}:00`);

        if (endDate <= startDate) {
          alert(
            t(
              "endTimeAfterStartTimeError",
              "End time must be after start time."
            )
          );
          // Or set an error state to display in the dialog
          return;
        }

        const result = await createShift(name, startTime, endTime);
        setIsDialogOpen(false);
        resetForm();
        if (result && !result.error) {
          // Successfully created
        } else if (result && result.error) {
          console.error("Error creating shift (in result):", result.error);
        }
      } catch (e) {
        console.error("Error creating shift (catch):", e);
      }
    } else {
      console.error("Validation Error: Name is required.");
    }
  };
  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <PlusCircleIcon className="h-5 w-5" />
          {t("create", "Create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("create_shift", "Create New Shift")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t(
              "create_shift_info",
              "Fill in the details below to add a new shift."
            )}
          </Dialog.Description>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label
                htmlFor="shift-name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("name", "Shift Name")}
              </label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                id="shift-name"
                placeholder={t("enter_name_placeholder", "e.g., Morning Shift")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Custom Time Picker Section */}
            <div className="space-y-3">
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("startTime", "Start Time")}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <select
                      id="start-hour"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className={selectClassName}
                    >
                      {hourOptions.map((hour) => (
                        <option key={`start-h-${hour}`} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">:</span>
                  <div className="flex-1 relative">
                    <select
                      id="start-minute"
                      value={startMinute}
                      onChange={(e) => setStartMinute(e.target.value)}
                      className={selectClassName}
                    >
                      {minuteOptions.map((minute) => (
                        <option key={`start-m-${minute}`} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("endTime", "End Time")}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <select
                      id="end-hour"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className={selectClassName}
                    >
                      {hourOptions.map((hour) => (
                        <option key={`end-h-${hour}`} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">:</span>
                  <div className="flex-1 relative">
                    <select
                      id="end-minute"
                      value={endMinute}
                      onChange={(e) => setEndMinute(e.target.value)}
                      className={selectClassName}
                    >
                      {minuteOptions.map((minute) => (
                        <option key={`end-m-${minute}`} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Custom Time Picker Section */}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50"
              >
                {t("cancel", "Cancel")}
              </button>
            </Dialog.Close>
            <button
              type="submit" // Can be submit if the parent div is a form, or keep as button
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm"
              onClick={handleSubmit} // onClick is fine if not a form submit
              disabled={loading || !name.trim()}
            >
              {loading ? t("saving", "Saving...") : t("save", "Save Shift")}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={t("closeDialog", "Close")}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateShiftDialogBtn;
