// src/components/shift/EditShiftDialog.tsx

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import { SquarePenIcon } from "lucide-react";
import { useUpdateShift } from "../../graphql/hook/shift";

// Helper to generate time options
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
const hourOptions = generateTimeOptions(24);
const minuteOptions = generateTimeOptions(60, 15);

interface EditShiftDialogProps {
  shift: IShift; // The shift to edit is now required
}

const EditShiftDialog: React.FC<EditShiftDialogProps> = ({ shift }) => {
  const { t } = useTranslation("translation");
  // The dialog now controls its own open/closed state
  const [isOpen, setIsOpen] = useState(false);

  // State for form fields
  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState("00");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("00");
  const [endMinute, setEndMinute] = useState("00");
  const { updateShift } = useUpdateShift();

  // This effect runs when the dialog is opened.
  // It populates the form with the data of the shift being edited.
  useEffect(() => {
    if (isOpen && shift) {
      setName(shift.name);
      const [sHour, sMin] = shift.startHour.split(":");
      const [eHour, eMin] = shift.endHour.split(":");
      setStartHour(sHour);
      setStartMinute(sMin);
      setEndHour(eHour);
      setEndMinute(eMin);
    }
  }, [isOpen, shift]); // Reruns when the dialog is opened

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (name.trim() !== "") {
      const startTime = `${startHour}:${startMinute}`;
      const endTime = `${endHour}:${endMinute}`;

      const updatedShiftDetails = {
        name: name,
        startHour: startTime,
        endHour: endTime,
      };

      await updateShift(shift.id.toString(), updatedShiftDetails);

      setIsOpen(false); // Close the dialog
    } else {
      console.error("Validation Error: Name is required.");
    }
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <SquarePenIcon className="h-5 w-5 text-gray-500 cursor-pointer hover:text-black" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-50">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("editShiftDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t("editShiftDialog.description")}
          </Dialog.Description>

          {/* Form Content */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="shift-name-edit"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("createShiftDialog.shiftName")}
              </label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                type="text"
                id="shift-name-edit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("createShiftDialog.startTime")}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <select
                      id="start-hour-edit"
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
                      id="start-minute-edit"
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("createShiftDialog.endTime")}
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <select
                      id="end-hour-edit"
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
                      id="end-minute-edit"
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
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
              onClick={handleSubmit}
              disabled={!name.trim()}
            >
              {t("common.save")}
            </button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={t("common.closeDialog")}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditShiftDialog;
