// src/components/breaks/EditBreakDialog.tsx

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../../graphql/interfaces";
import { Pencil, X, LoaderCircle } from "lucide-react";
import { useUpdateBreak } from "../../graphql/hook/break";
import { toast } from "react-toastify";
import { timeToMinutes } from "../../utils/time-converters";
import ValidationError from "../general/ValidationError";
import UnsavedChangesDialog from "../general/UnsavedChangesDialog"; // 1. Импортираме компонента

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
const minuteOptions = generateTimeOptions(60, 5);

interface Props {
  breakItem: IBreaks;
  allBreaks: IBreaks[];
}

const EditBreakDialog: React.FC<Props> = ({ breakItem, allBreaks }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // 2. Добавяме новото състояние

  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("15");

  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [initialState, setInitialState] = useState({
    name: "",
    startTime: "",
    endTime: "",
  });

  const { updateBreak, loading, error: serverError } = useUpdateBreak();

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  useEffect(() => {
    if (isOpen) {
      const initial = {
        name: breakItem.name,
        startTime: breakItem.startTime.slice(0, 5),
        endTime: breakItem.endTime.slice(0, 5),
      };

      setName(initial.name);
      const [sH, sM] = initial.startTime.split(":");
      const [eH, eM] = initial.endTime.split(":");
      setStartHour(sH);
      setStartMinute(sM);
      setEndHour(eH);
      setEndMinute(eM);
      setInitialState(initial);

      setIsDirty(false);
      setValidationError(null);
    }
  }, [isOpen, breakItem]);

  useEffect(() => {
    const currentStartTime = `${startHour}:${startMinute}`;
    const currentEndTime = `${endHour}:${endMinute}`;

    const dirty =
      name.trim() !== initialState.name ||
      currentStartTime !== initialState.startTime ||
      currentEndTime !== initialState.endTime;

    setIsDirty(dirty);
  }, [name, startHour, startMinute, endHour, endMinute, initialState]);

  // 3. Добавяме функцията за опит за затваряне
  const handleAttemptClose = () => {
    if (isDirty) {
      setShowConfirm(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    if (
      allBreaks.some(
        (b) =>
          b.id !== breakItem.id &&
          b.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      triggerError("breaksPage.editDialog.nameExistsError");
      return;
    }

    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
      triggerError("breaksPage.editDialog.timeValidationError");
      return;
    }

    try {
      await updateBreak(breakItem.id, trimmedName, startTime, endTime);
      toast.success(t("breaksPage.editDialog.successToast"));
      setIsDirty(false); // Reset dirty state on success
      setIsOpen(false);
    } catch (e) {
      // Server error is handled by the `serverError` state below
    }
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm";

  return (
    <>
      <Dialog.Root
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleAttemptClose();
          else setIsOpen(true);
        }}
      >
        <Dialog.Trigger asChild>
          <button
            title={t("common.edit")}
            className="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-100 transition-colors"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              handleAttemptClose();
            }}
            onPointerDownOutside={(e) => {
              e.preventDefault();
              handleAttemptClose();
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-50"
          >
            <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
              {t("breaksPage.editDialog.title")}
            </Dialog.Title>
            <Dialog.Description className="mb-5 text-sm text-slate-500">
              {t("breaksPage.editDialog.description")}
            </Dialog.Description>

            <form id="edit-break-form" onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="break-name-edit"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("breaksPage.editDialog.nameLabel")}
                  </label>
                  <input
                    id="break-name-edit"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("breaksPage.editDialog.startTime")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="start-hour-edit"
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
                      id="start-minute-edit"
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
                    {t("breaksPage.editDialog.endTime")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="end-hour-edit"
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
                      id="end-minute-edit"
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

              <div className="mt-4 min-h-[20px]">
                <ValidationError error={validationError} />
                {serverError && (
                  <p className="text-sm text-red-600">{serverError.message}</p>
                )}
              </div>
            </form>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleAttemptClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                form="edit-break-form"
                disabled={loading || !isDirty}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {t("common.saveChanges")}
              </button>
            </div>

            <Dialog.Close asChild>
              <button
                onClick={handleAttemptClose}
                className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 4. Добавяме UnsavedChangesDialog */}
      <UnsavedChangesDialog
        isOpen={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default EditBreakDialog;
