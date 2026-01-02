import React from "react";
import { Loader2, ServerCog } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SchedulerBlockerProps {
  isVisible: boolean;
}

const SchedulerBlocker: React.FC<SchedulerBlockerProps> = ({ isVisible }) => {
  const { t } = useTranslation();
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm text-center border border-indigo-100 animate-in fade-in zoom-in duration-300">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-25"></div>
          <div className="bg-indigo-100 p-4 rounded-full relative">
            <ServerCog className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {t("ordersPage.optimizer.schedulingInProgress")}
        </h3>

        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          <br />
          <span className="font-semibold text-indigo-600">
            {t("ordersPage.optimizer.pleaseWaitWhileScheduling")}
          </span>
        </p>

        <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            {t("ordersPage.optimizer.planning")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SchedulerBlocker;
