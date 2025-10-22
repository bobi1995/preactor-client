import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateBreak } from "../../graphql/hook/break";
import { IBreaks } from "../../graphql/interfaces";
import { toast } from "react-toastify";
import ValidationError from "../general/ValidationError";

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

const hourOptions = generateTimeOptions(24);
const minuteOptions = generateTimeOptions(60, 5);

interface CreateBreakDialogProps {
  allBreaks: IBreaks[];
}

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
    setValidationError({ message: t(messageKey), key: Date.now() });
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
      toast.success(t("breaksPage.createDialog.successToast"));
    } catch (err) {
      console.error("Error creating break:", err);
      triggerError("errors.errorGeneral");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      resetForm();
    }
    setIsDialogOpen(open);
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm";

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={handleOpenChange}>
      <style>{animationStyle}</style>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md">
          <PlusCircle className="h-5 w-5" />
          {t("common.create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm data-[state=open]:animate-overlayShow z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-50">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("breaksPage.createDialog.title")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t("breaksPage.createDialog.description")}
          </Dialog.Description>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="break-name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("breaksPage.createDialog.nameLabel")}
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  type="text"
                  id="break-name"
                  placeholder={t("breaksPage.createDialog.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("breaksPage.createDialog.startTime")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="start-hour"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      className={selectClassName}
                    >
                      {hourOptions.map((h) => (
                        <option key={`s-h-${h}`} value={h}>
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
                        <option key={`s-m-${m}`} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {t("breaksPage.createDialog.endTime")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      id="end-hour"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      className={selectClassName}
                    >
                      {hourOptions.map((h) => (
                        <option key={`e-h-${h}`} value={h}>
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
                        <option key={`e-m-${m}`} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <ValidationError error={validationError} />

            <div className="mt-2 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                disabled={loading || !name.trim()}
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {loading ? t("common.saving") : t("common.save")}
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateBreakDialog;
