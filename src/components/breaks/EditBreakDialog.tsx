import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { IBreaks } from "../../graphql/interfaces";
import { Pencil, X, LoaderCircle } from "lucide-react";
import { useUpdateBreak } from "../../graphql/hook/break";

// Помощна функция за генериране на опции за време
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
}

const EditBreakDialog: React.FC<Props> = ({ breakItem }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // State за полетата във формата
  const [name, setName] = useState(breakItem.name);
  const [startHour, setStartHour] = useState("12");
  const [startMinute, setStartMinute] = useState("00");
  const [endHour, setEndHour] = useState("12");
  const [endMinute, setEndMinute] = useState("15");
  const { updateBreak, loading, error } = useUpdateBreak();
  // Попълване на формата с данни, когато диалогът се отвори
  useEffect(() => {
    if (isOpen) {
      setName(breakItem.name);
      const [sHour, sMinute] = breakItem.startTime.split(":");
      const [eHour, eMinute] = breakItem.endTime.split(":");
      setStartHour(sHour);
      setStartMinute(sMinute);
      setEndHour(eHour);
      setEndMinute(eMinute);
    }
  }, [isOpen, breakItem]);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const startTime = `${startHour}:${startMinute}`;
    const endTime = `${endHour}:${endMinute}`;

    await updateBreak(breakItem.id, name, startTime, endTime);
    setIsOpen(false);
  };

  const selectClassName =
    "w-full appearance-none bg-white px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm";

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          title={t("common.edit", "Редактирай")}
          className="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-100 transition-colors"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 data-[state=open]:animate-contentShow focus:outline-none z-50">
          <Dialog.Title className="text-xl font-semibold mb-1 text-slate-800">
            {t("editBreakDialog.title", "Редактиране на почивка")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-slate-500">
            {t("editBreakDialog.description", "Променете детайлите по-долу.")}
          </Dialog.Description>

          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              {/* Поле за име */}
              <div>
                <label
                  htmlFor="break-name-edit"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("editBreakDialog.breakName", "Име на почивката")}
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
              {/* Полета за начален час */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("editBreakDialog.startTime", "Начален час")}
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
              {/* Полета за краен час */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t("editBreakDialog.endTime", "Краен час")}
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

            {error && (
              <p className="text-sm text-red-600 mt-4">{error.message}</p>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  {t("common.cancel", "Отказ")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {t("common.saveChanges", "Запази промените")}
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

export default EditBreakDialog;
