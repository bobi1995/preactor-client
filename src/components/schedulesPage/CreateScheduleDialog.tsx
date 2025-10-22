import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useCreateSchedule } from "../../graphql/hook/schedule";
import { toast } from "react-toastify";
import { ISchedule } from "../../graphql/interfaces";
import ValidationError from "../general/ValidationError";

const ERROR_CODE_MAP: { [key: string]: string } = {
  BAD_USER_INPUT: "errors.createErrorDuplicate",
  INTERNAL_SERVER_ERROR: "errors.errorGeneral",
};
interface CreateScheduleDialogProps {
  allSchedules: ISchedule[];
}

const CreateScheduleDialog: React.FC<CreateScheduleDialogProps> = ({
  allSchedules,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const { createSchedule, loading } = useCreateSchedule();
  const [validationError, setValidationError] = useState<{
    message: string;
    key: number;
  } | null>(null);

  const triggerError = (messageKey: string) => {
    setValidationError({ message: t(messageKey), key: Date.now() });
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);

    if (name.trim() === "") {
      triggerError("common.nameRequired");
      return;
    }
    if (
      allSchedules.some(
        (s) => s.name.toLowerCase() === name.trim().toLowerCase()
      )
    ) {
      triggerError("errors.createErrorDuplicate");
      return;
    }

    try {
      const newSchedule = await createSchedule(name.trim());
      if (newSchedule?.id) {
        toast.success(
          t("success.createSuccess", { scheduleName: name.trim() })
        );
        navigate(`/schedule/${newSchedule.id}`);
      }
    } catch (e: any) {
      const translationKey = ERROR_CODE_MAP[e.message] || "errors.errorGeneral";
      triggerError(translationKey);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName("");
    }
    setIsOpen(open);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md">
          <PlusCircle size={18} /> {t("common.create")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl max-w-md w-[90vw] p-6 z-50">
          <Dialog.Title className="text-xl font-semibold">
            {t("schedulesPage.createDialogTitle")}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            {t("schedulesPage.createDialogDescription")}
          </Dialog.Description>
          <form onSubmit={handleCreate} className="mt-4">
            <div>
              <label
                htmlFor="schedule-name"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                {t("schedulesPage.nameLabel")}
              </label>
              <input
                id="schedule-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("schedulesPage.namePlaceholder")}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                required
              />
            </div>
            <ValidationError error={validationError} />
            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="px-4 py-2 bg-slate-100 rounded-md"
                >
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="inline-flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded-md"
              >
                {loading && (
                  <LoaderCircle className="animate-spin -ml-1 mr-2 h-4 w-4" />
                )}
                {loading ? t("common.saving") : t("common.create")}
              </button>
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4" aria-label="Close">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateScheduleDialog;
