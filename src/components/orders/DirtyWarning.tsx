// src/components/orders/DirtyWarning.tsx
import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  isVisible: boolean;
}

const DirtyWarning: React.FC<Props> = ({ isVisible }) => {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded-r shadow-sm animate-in slide-in-from-top-2">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700 font-medium">
            {t("ordersPage.dirtyWarning.title", "Schedule Out of Sync")}
          </p>
          <p className="text-xs text-amber-600 mt-1">
            {t(
              "ordersPage.dirtyWarning.message",
              "Changes have been made to orders. The current schedule may be invalid. Please run the Optimizer."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirtyWarning;
