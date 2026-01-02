import React from "react";
import { X, CheckCircle, AlertCircle, Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SchedulerResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message?: string;
  output?: string;
}

const SchedulerResultModal: React.FC<SchedulerResultModalProps> = ({
  isOpen,
  onClose,
  success,
  message,
  output,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between border-b ${
            success
              ? "bg-green-50 border-green-100"
              : "bg-red-50 border-red-100"
          }`}
        >
          <div className="flex items-center gap-3">
            {success ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600" />
            )}
            <div>
              <h3
                className={`font-bold ${
                  success ? "text-green-800" : "text-red-800"
                }`}
              >
                {success
                  ? t("ordersPage.optimizer.success")
                  : t("ordersPage.optimizer.error")}
              </h3>
              <p
                className={`text-xs ${
                  success ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Logs) */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          <div className="flex items-center gap-2 mb-2 text-gray-700 font-semibold text-sm">
            <Terminal className="w-4 h-4" />
            <span>{t("ordersPage.optimizer.systemOutput")}:</span>
          </div>
          <div className="bg-slate-900 text-slate-50 p-4 rounded-md font-mono text-xs overflow-x-auto whitespace-pre-wrap max-h-96 shadow-inner border border-slate-700">
            {output || t("ordersPage.optimizer.noOutput")}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            {t("common.close", "Close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulerResultModal;
