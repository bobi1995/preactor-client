import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useBreaks, useCreateBreak } from "../../graphql/hook/shift";
import { useTranslation } from "react-i18next";

// Helper to generate time options for custom selects
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

const CreateNewBreakBtn: React.FC = () => {
  const { t } = useTranslation();
  const { createBreak, loading } = useCreateBreak();
  const { reload: reloadBreaksList } = useBreaks(); // Get the reload function
  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("30");
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setName("");
    setStartHour("12");
    setStartMinute("00");
    setEndHour("12");
    setEndMinute("30");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      resetForm();
    }
    setOpen(isOpen);
  };

  const handleSubmit = async () => {
    if (name.trim() !== "") {
      const startTime = `${startHour}:${startMinute}`;
      const endTime = `${endHour}:${endMinute}`;

      try {
        const startDate = new Date(`1970-01-01T${startTime}:00`);
        const endDate = new Date(`1970-01-01T${endTime}:00`);

        if (endDate <= startDate) {
          alert(t("createShiftDialog.endTimeAfterStartTimeError")); // Re-using existing translation
          return;
        }

        const result = await createBreak(name, startTime, endTime);
        if (result && !result.error) {
          reloadBreaksList(); // Reload the list in the underlying dialog
          setOpen(false); // Close this dialog
        } else {
          console.error("Error creating break:", result?.error);
        }
      } catch (e) {
        console.error("Error creating break:", e);
      }
    } else {
      console.error("Validation Error: Name is required.");
    }
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer font-medium">
          {t("createNewBreakDialog.link")}
        </button>
      </Dialog.Trigger>
      {/* Set a higher z-index on the Portal to ensure it renders above the previous dialog */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm data-[state=open]:animate-overlayShow z-[60]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-lg w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-[70]">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("createNewBreakDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t("createNewBreakDialog.description")}
          </Dialog.Description>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="break-name-input"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("common.name")}
              </label>
              <input
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                id="break-name-input"
                placeholder={t("createNewBreakDialog.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                {t("createNewBreakDialog.timeRangeLabel")}
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
                <span className="px-2 text-slate-400">-</span>
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

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close asChild>
              <button
                type="button"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50"
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm"
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
            >
              {loading ? t("common.saving") : t("common.save")}
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

export default CreateNewBreakBtn;
