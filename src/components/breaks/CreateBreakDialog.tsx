import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, LoaderCircle, AlertTriangleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateBreak } from "../../graphql/hook/break";
import { IBreaks } from "../../graphql/interfaces";

interface CreateBreakDialogProps {
  allBreaks: IBreaks[]; // Prop to receive all existing breaks
}

const animationStyle = `
  @keyframes shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-3px); }
    40%, 60% { transform: translateX(3px); }
  }
  .animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
`;

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
const minuteOptions = generateTimeOptions(60, 5); // 00, 05, 10... 55

const CreateBreakDialog: React.FC<CreateBreakDialogProps> = ({ allBreaks }) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("15");
  const { createBreak, loading, error } = useCreateBreak();
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);
  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Math.random() });
  };

  const resetForm = () => {
    setName("");
    setStartHour("12");
    setStartMinute("00");
    setEndHour("12");
    setEndMinute("15");
    setValidationError(null);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    if (name.trim() === "") {
      triggerError("common.nameRequired");
      return;
    }

    if (
      allBreaks.some((b) => b.name.toLowerCase() === name.trim().toLowerCase())
    ) {
      triggerError("breaksPage.createDialog.nameExistsError");
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

    try {
      await createBreak(name, startTime, endTime);
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error creating break:", err);
      triggerError("common.errorGeneral");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm();
    }
    setIsDialogOpen(open);
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
      <style>{animationStyle}</style>

      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <PlusCircle className="h-5 w-5" />
          {t("common.create", "Създай")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-50">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("createBreakDialog.title", "Създаване на нова почивка")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t(
              "createBreakDialog.description",
              "Въведете детайлите за новата почивка."
            )}
          </Dialog.Description>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="break-name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("createBreakDialog.breakName", "Име на почивката")}
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  type="text"
                  id="break-name"
                  placeholder={t(
                    "createBreakDialog.namePlaceholder",
                    "Напр. Обедна почивка"
                  )}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("createBreakDialog.startTime", "Начален час")}
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
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("createBreakDialog.endTime", "Краен час")}
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
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Показване на съобщение за грешка */}
            <div className="mt-4 h-12 flex items-center">
              {validationError && (
                <div
                  key={validationError.key} // The key forces a re-render and re-triggers the animation
                  className="bg-red-50 p-3 rounded-md flex items-center space-x-3 w-full animate-shake"
                >
                  <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    {validationError.message}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50"
                >
                  {t("common.cancel", "Отказ")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 shadow-sm"
                disabled={loading || !name.trim()}
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {loading
                  ? t("common.saving", "Запис...")
                  : t("common.save", "Запис")}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={t("common.closeDialog", "Затвори диалога")}
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateBreakDialog;
