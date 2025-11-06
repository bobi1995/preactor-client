import React from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Calendar } from "lucide-react";

interface ScheduleLinkProps {
  // Make props optional to handle cases where there is no schedule
  scheduleId?: string | null;
  scheduleName?: string | null;
}

const ScheduleLink: React.FC<ScheduleLinkProps> = ({
  scheduleId,
  scheduleName,
}) => {
  const { t } = useTranslation();

  // Handle the case where there is no schedule
  if (!scheduleId || !scheduleName) {
    return (
      <span className="italic text-gray-500 text-xs">
        {t("resourceTable.noScheduleAssigned", "No schedule assigned")}
      </span>
    );
  }

  // Build the destination URL
  const destinationUrl = `/schedule/${scheduleId}`;

  return (
    <Link
      to={destinationUrl}
      // Apply "pill" styling, similar to your ShiftTable's break button
      className="inline-flex items-center bg-indigo-100 text-indigo-700 font-medium text-xs px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors"
      title={t(
        "resourceTable.viewScheduleTooltip", // You may need to add this key
        "View schedule: {{scheduleName}}",
        { scheduleName }
      )}
    >
      <Calendar className="w-3.5 h-3.5 mr-1.5" />
      {scheduleName}
    </Link>
  );
};

export default ScheduleLink;
