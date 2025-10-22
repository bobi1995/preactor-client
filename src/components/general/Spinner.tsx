import React from "react";
import { useTranslation } from "react-i18next";

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  const combinedClassName = `h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-indigo-600 ${
    className || ""
  }`;
  const { t } = useTranslation();

  return (
    <div className={combinedClassName.trim()} role="status" aria-live="polite">
      <span className="sr-only">{t("common.loading", "Loading...")}</span>
    </div>
  );
};

export default Spinner;
