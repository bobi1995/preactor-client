import { useParams } from "react-router";
import * as Tabs from "@radix-ui/react-tabs";
import ErrorComponent from "../components/general/Error";
import { useShift } from "../graphql/hook/shift";
import InfinityLoader from "../components/general/Loader";
import TimelineComponent from "../components/general/gant/Timeline";
import BreaksTable from "../components/shiftPage/BreaksTable";
import { useTranslation } from "react-i18next";
import { IBreaks, IResource } from "../graphql/interfaces";
import ResourcesTable from "../components/shiftPage/ResourcesTable";
import AssignBreakDialogBtn from "../components/shiftPage/AssignBreakDialogBtn"; // Now used here
import { unixToHoursWithTimezone } from "../utils/time-converters";

const ShiftPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  if (!id) {
    return <ErrorComponent message={t("shiftPage.shiftNotFound")} />;
  }

  const { shift, loading, error, reload } = useShift(parseInt(id));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <InfinityLoader />
      </div>
    );
  }

  if (error || !shift) {
    return (
      <div className="p-4">
        <ErrorComponent
          message={t("shiftPage.unableToFetchShift")}
          onRetry={reload}
        />
      </div>
    );
  }

  const { name: shiftName, startHour, endHour, breaks, resources } = shift;

  // Your time conversion logic remains the same
  const timeToDecimal = (timeStr: string): number => {
    if (typeof timeStr !== "string" || !timeStr.includes(":")) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  if (typeof startHour !== "string" || typeof endHour !== "string") {
    return (
      <div className="p-4">
        <ErrorComponent message={t("shiftPage.invalidShiftData")} />
      </div>
    );
  }

  const startDecimal = timeToDecimal(startHour);
  let endDecimal = timeToDecimal(endHour);
  if (endDecimal < startDecimal) endDecimal += 24;
  const leftPercentage = (startDecimal / 24) * 100;
  const widthPercentage =
    ((Math.max(endDecimal, startDecimal) - startDecimal) / 24) * 100;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header (unchanged) */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          {t("shiftPage.title")}:{" "}
          <span className="text-indigo-600">{shiftName}</span>
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t("shiftPage.viewingDetailsFor", {
            startHour: unixToHoursWithTimezone(startHour),
            endHour: unixToHoursWithTimezone(endHour),
          })}
        </p>
      </div>

      {/* Timeline Card (unchanged) */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6">
        <div className="mb-2">
          <TimelineComponent viewType="hours" day={new Date()} />
        </div>
        <div className="relative h-12 bg-slate-100 rounded-lg border border-slate-200">
          {/* Shift Interval */}
          <div
            className="absolute inset-y-0 bg-indigo-500 rounded"
            style={{
              left: `${leftPercentage}%`,
              width: `${widthPercentage}%`,
              zIndex: 10,
            }}
            title={`${t("common.shift")}: ${startHour} - ${endHour}`}
          ></div>
          {/* Breaks Intervals */}
          {Array.isArray(breaks) &&
            breaks.map((breakItem: IBreaks | null) => {
              if (
                !breakItem ||
                typeof breakItem.startTime !== "string" ||
                typeof breakItem.endTime !== "string"
              )
                return null;
              const breakStartDecimal = timeToDecimal(breakItem.startTime);
              const breakEndDecimal = timeToDecimal(breakItem.endTime);
              const breakLeftPercentage = (breakStartDecimal / 24) * 100;
              const breakWidthPercentage =
                ((breakEndDecimal - breakStartDecimal) / 24) * 100;
              if (
                breakStartDecimal >= startDecimal &&
                breakEndDecimal <= endDecimal
              ) {
                return (
                  <div
                    key={breakItem.id}
                    className="absolute inset-y-0 bg-sky-400/80"
                    style={{
                      left: `${breakLeftPercentage}%`,
                      width: `${breakWidthPercentage}%`,
                      zIndex: 20,
                    }}
                    title={`${t("common.break")}: ${breakItem.startTime} - ${
                      breakItem.endTime
                    }`}
                  ></div>
                );
              }
              return null;
            })}
        </div>
        <p className="mt-2 text-xs text-slate-400 text-center">
          {t("shiftPage.timelineNote")}
        </p>
      </div>

      {/* NEW Tabbed Section */}
      <Tabs.Root defaultValue="breaks" className="w-full">
        <Tabs.List className="flex border-b border-slate-200">
          <Tabs.Trigger
            value="breaks"
            className="px-4 py-2.5 -mb-px text-sm font-medium text-slate-500 border-b-2 border-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {t("shiftPage.tabs.breaks")}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="resources"
            className="px-4 py-2.5 -mb-px text-sm font-medium text-slate-500 border-b-2 border-transparent data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {t("shiftPage.tabs.resources")}
          </Tabs.Trigger>
        </Tabs.List>
        <div className="mt-6">
          <Tabs.Content value="breaks">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-700">
                  {t("shiftPage.breaksTitle")}
                </h2>
                {/* The "Assign" button is now here, in the context of the breaks table */}
                <AssignBreakDialogBtn
                  shiftId={id}
                  onAssignmentSuccess={reload}
                  assignedBreaks={
                    Array.isArray(breaks)
                      ? (breaks.filter((b) => b !== null) as IBreaks[])
                      : []
                  }
                />
              </div>
              <div className="p-6">
                <BreaksTable
                  shiftId={parseInt(id)}
                  breaks={
                    Array.isArray(breaks)
                      ? (breaks.filter((b) => b !== null) as IBreaks[])
                      : []
                  }
                  //   onActionSuccess={reload}
                />
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="resources">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-700">
                  {t("shiftPage.resourcesTitle")}
                </h2>
                {/* You could add an "Assign Resources" button here in the future */}
              </div>
              <div className="p-6">
                {Array.isArray(resources) && resources.length > 0 ? (
                  <ResourcesTable
                    resources={
                      resources.filter((r) => r !== null) as IResource[]
                    }
                  />
                ) : (
                  <div className="text-center text-slate-500 py-8">
                    <p>
                      {t(
                        "shiftPage.noResourcesAssigned",
                        "No resources are assigned to this shift."
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default ShiftPage;
