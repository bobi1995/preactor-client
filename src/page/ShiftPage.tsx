import React from "react";
import { useParams } from "react-router"; // Assuming react-router-dom for useParams
import ErrorComponent from "../components/general/Error";
import { useShift } from "../graphql/hook/shift";
import InfinityLoader from "../components/general/Loader";
import TimelineComponent from "../components/general/gant/Timeline"; // Assuming this is your gantt chart
import ShiftInfo from "../components/shiftPage/ShiftInfo";
import BreaksTable from "../components/shiftPage/BreaksTable";
import { useTranslation } from "react-i18next";
import { IBreaks, IResource } from "../graphql/interfaces"; // Assuming IResource is also in interfaces
import ResourcesTable from "../components/shiftPage/ResourcesTable"; // Enabled this

const ShiftPage = () => {
  const { id } = useParams<{ id: string }>(); // Added type for id
  const { t } = useTranslation(["shift", "common"]); // Added "common" namespace if needed for generic terms

  if (!id) {
    // This condition might be redundant if your routing ensures id is always present
    // or useParams throws if id is not in the path.
    return (
      <ErrorComponent message={t("shift:shiftNotFound", "Shift not found")} />
    );
  }

  const { shift, loading, error, reload } = useShift(parseInt(id));

  console.log("Shift data:", shift); // Debugging log to check fetched shift data

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <InfinityLoader />
      </div>
    );
  }

  if (error || !shift) {
    // Added !shift check for robustness
    return (
      <div className="p-4">
        <ErrorComponent
          message={t(
            "shift:unableToFetchShift",
            "Unable to fetch shift. Please check your connection."
          )}
          onRetry={() => reload()}
        />
      </div>
    );
  }

  const { name: shiftName, startHour, endHour, breaks, resources } = shift; // Destructure name for use in timeline

  // Helper function for time to decimal conversion
  const timeToDecimal = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const startDecimal = timeToDecimal(startHour);
  let endDecimal = timeToDecimal(endHour);

  // Adjust endDecimal if it crosses midnight for visualization purposes on a 24h bar
  // This assumes shifts are visualized on a single 24h scale.
  if (endDecimal < startDecimal) {
    endDecimal += 24;
  }

  const leftPercentage = (startDecimal / 24) * 100;
  // Ensure width is not negative if endDecimal wasn't adjusted but was indeed smaller
  const widthPercentage =
    ((Math.max(endDecimal, startDecimal) - startDecimal) / 24) * 100;

  // Card component for consistent styling
  const Card: React.FC<{
    title?: string;
    children: React.ReactNode;
    className?: string;
  }> = ({ title, children, className }) => (
    <div
      className={`bg-white shadow-xl rounded-xl overflow-hidden ${className}`}
    >
      {title && (
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          {t("shift:shiftDetails", "Shift Details")}:{" "}
          <span className="text-indigo-600">{shiftName}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(
            "shift:viewingDetailsFor",
            "Viewing details for shift starting at {{startHour}} and ending at {{endHour}}.",
            { startHour, endHour }
          )}
        </p>
      </div>

      {/* Timeline Visualization Section */}
      <Card
        title={t(
          "shift:shiftTimelineVisualization",
          "Shift Timeline Visualization"
        )}
      >
        {/* External Timeline Component (if it shows hours of the day) */}
        <div className="mb-2">
          <TimelineComponent viewType="hours" day={new Date()} />{" "}
          {/* Example, adjust as needed */}
        </div>

        {/* Custom Shift Bar */}
        <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          {/* Shift Interval */}
          <div
            className="absolute inset-y-0 bg-indigo-500 rounded flex items-center justify-center text-white text-xs font-medium shadow-inner"
            style={{
              left: `${Math.max(0, leftPercentage)}%`, // Ensure left is not negative
              width: `${Math.min(
                100 - Math.max(0, leftPercentage),
                widthPercentage
              )}%`, // Ensure width fits
              zIndex: 10,
            }}
            title={`${t("shift:shift", "Shift")}: ${startHour} - ${endHour}`}
          >
            {/* Optional: Show shift name or time if width allows */}
            {/* {widthPercentage > 10 && <span className="truncate px-2">{shiftName}</span>} */}
          </div>

          {/* Breaks Intervals (rendered on top of the shift bar) */}
          {breaks.map((breakItem: IBreaks) => {
            const breakStartDecimal = timeToDecimal(breakItem.startHour);
            let breakEndDecimal = timeToDecimal(breakItem.endHour);

            if (breakEndDecimal < breakStartDecimal) {
              // Handle breaks crossing midnight if necessary
              breakEndDecimal += 24;
            }
            // Calculate position relative to the day start (00:00)
            const breakLeftPercentage = (breakStartDecimal / 24) * 100;
            const breakWidthPercentage =
              ((breakEndDecimal - breakStartDecimal) / 24) * 100;

            // Ensure break is visually within the main shift bar if it's meant to be
            // This check is simplistic; depends on whether breaks can be outside shift times
            if (
              breakStartDecimal >= startDecimal &&
              breakEndDecimal <= endDecimal
            ) {
              return (
                <div
                  key={breakItem.id}
                  className="absolute inset-y-0 bg-sky-400/80 border-x border-sky-500/50 rounded-sm flex items-center justify-center text-white text-xs font-extralight"
                  style={{
                    left: `${breakLeftPercentage}%`,
                    width: `${breakWidthPercentage}%`,
                    zIndex: 20, // Higher z-index to be on top of the main shift bar
                  }}
                  title={`${t("shift:break", "Break")}: ${
                    breakItem.startHour
                  } - ${breakItem.endHour}`}
                >
                  {/* {breakWidthPercentage > 5 && <span className="truncate px-1">{breakItem.name || t('common:break', 'Break')}</span>} */}
                </div>
              );
            }
            return null; // Or render breaks differently if they can be outside shift times
          })}
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center">
          {t(
            "shift:timelineRepresents24h",
            "Timeline represents a 24-hour period."
          )}
        </p>
      </Card>

      {/* Information and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <Card title={t("shift:shiftInformation", "Shift Information")}>
            <ShiftInfo {...shift} t={t} />
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <Card title={t("shift:breaks", "Breaks")}>
            <BreaksTable breaks={breaks} t={t} />
          </Card>
          {resources &&
            resources.length > 0 && ( // Conditionally render ResourcesTable
              <Card title={t("shift:assignedResources", "Assigned Resources")}>
                <ResourcesTable resources={resources} t={t} />
              </Card>
            )}
        </div>
      </div>
    </div>
  );
};

export default ShiftPage;
