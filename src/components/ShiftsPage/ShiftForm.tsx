// src/components/ShiftsPage/ShiftForm.tsx

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import ValidationError from "../general/ValidationError";

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
  initialData?: IShift | null;
  onSubmit: (details: {
    name: string;
    startHour: string;
    endHour: string;
  }) => void;
  allShifts?: IShift[];
  onDirtyChange: (isDirty: boolean) => void;
  serverError?: string | null;
  onClearServerError?: () => void;
}

export const ShiftForm: React.FC<ShiftFormProps> = ({
  initialData,
  onSubmit,
  allShifts = [],
  onDirtyChange,
  serverError,
  onClearServerError,
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
  const [initialState, setInitialState] = useState({
    name: "",
    startHour: "08:00",
    endHour: "17:00",
  });

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  // Effect to display server error when it comes from the parent
  useEffect(() => {
    if (serverError) {
      setValidationError({ message: serverError, key: Date.now() });
    }
  }, [serverError]);

  // Effect to set initial form data
  useEffect(() => {
    const data = initialData
      ? {
          name: initialData.name,
          startHour: initialData.startHour.slice(0, 5),
          endHour: initialData.endHour.slice(0, 5),
        }
      : { name: "", startHour: "08:00", endHour: "17:00" };

    setName(data.name);
    const [sH, sM] = data.startHour.split(":");
    const [eH, eM] = data.endHour.split(":");
    setStartHour(sH);
    setStartMinute(sM);
    setEndHour(eH);
    setEndMinute(eM);
    setInitialState(data);
  }, [initialData]);

  // Effect to track dirty state and clear errors on user input
  useEffect(() => {
    const currentStart = `${startHour}:${startMinute}`;
    const currentEnd = `${endHour}:${endMinute}`;
    const isDirty =
      name.trim() !== initialState.name ||
      currentStart !== initialState.startHour ||
      currentEnd !== initialState.endHour;
    onDirtyChange(isDirty);

    // If the user starts typing, clear any displayed validation error
    if (isDirty) {
      setValidationError(null);
      onClearServerError?.();
    }
  }, [
    name,
    startHour,
    startMinute,
    endHour,
    endMinute,
    initialState,
    onDirtyChange,
    onClearServerError,
  ]);

  // Original handleSubmit logic is fully restored
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    onClearServerError?.();

    if (name.trim() === "") {
      triggerError("common.nameRequired");
      return;
    }
    // Client-side check for duplicates (works when allShifts is available)
    if (
      allShifts.length > 0 &&
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

    if (endDate <= startDate) {
      triggerError("createShiftDialog.endTimeAfterStartTimeError");
      return;
    }

    onSubmit({
      name: name.trim(),
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

      {/* The validation component is restored and works for all errors */}
      <div className="min-h-[20px]">
        <ValidationError error={validationError} />
      </div>
    </form>
  );
};
