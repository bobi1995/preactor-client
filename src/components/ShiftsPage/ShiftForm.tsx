// src/components/shift/ShiftForm.tsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import { AlertTriangleIcon } from "lucide-react";

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

interface ShiftFormProps {
  initialData?: IShift | null; // Optional initial data for editing
  onSubmit: (details: {
    name: string;
    startHour: string;
    endHour: string;
  }) => void;
  allShifts?: IShift[];
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
  initialData,
  onSubmit,
  allShifts = [],
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState("08");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("17");
  const [endMinute, setEndMinute] = useState("00");
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      const [sHour, sMin] = initialData.startHour.split(":");
      const [eHour, eMin] = initialData.endHour.split(":");
      setStartHour(sHour);
      setStartMinute(sMin);
      setEndHour(eHour);
      setEndMinute(eMin);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (name.trim() === "") {
      triggerError("common.nameRequired");
      return;
    }
    if (
      allShifts.some(
        (s) =>
          s.id !== initialData?.id &&
          s.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      triggerError("createShiftDialog.nameExistsError");
      return;
    }
    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;
    const startDate = new Date(`1970-01-01T${startTime}:00`);
    const endDate = new Date(`1970-01-01T${endTime}:00`);

    // The new validation logic
    if (endDate <= startDate) {
      triggerError("createShiftDialog.endTimeAfterStartTimeError");
      return; // Stop the submission
    }

    onSubmit({
      name,
      startHour: startTime,
      endHour: endTime,
    });
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <form id="shift-form" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="shift-name"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {t("createShiftDialog.shiftName")}
        </label>
        <input
          id="shift-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={t("createShiftDialog.namePlaceholder")}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("createShiftDialog.startTime")}
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="start-hour"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className={selectClassName}
            >
              {hourOptions.map((h) => (
                <option key={`start-h-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              id="start-minute"
              value={startMinute}
              onChange={(e) => setStartMinute(e.target.value)}
              className={selectClassName}
            >
              {minuteOptions.map((m) => (
                <option key={`start-m-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t("createShiftDialog.endTime")}
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="end-hour"
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              className={selectClassName}
            >
              {hourOptions.map((h) => (
                <option key={`end-h-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              id="end-minute"
              value={endMinute}
              onChange={(e) => setEndMinute(e.target.value)}
              className={selectClassName}
            >
              {minuteOptions.map((m) => (
                <option key={`end-m-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="h-12 flex items-center">
        {validationError && (
          <div
            key={validationError.key}
            className="bg-red-50 p-3 rounded-md flex items-center space-x-3 w-full animate-shake"
          >
            <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-800">{validationError.message}</p>
          </div>
        )}
      </div>
    </form>
  );
};
