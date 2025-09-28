import React from "react";
import { useParams } from "react-router";
import ErrorComponent from "../components/general/Error";
import { useShift } from "../graphql/hook/shift";
import InfinityLoader from "../components/general/Loader";
import TimelineComponent from "../components/general/gant/Timeline";
import ShiftInfo from "../components/shiftPage/ShiftInfo";
import BreaksTable from "../components/shiftPage/BreaksTable";
import { useTranslation } from "react-i18next";
import { IBreaks, IResource } from "../graphql/interfaces";
import ResourcesTable from "../components/shiftPage/ResourcesTable";
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
          onRetry={() => reload()}
        />
      </div>
    );
  }

  const { name: shiftName, startHour, endHour, breaks, resources } = shift;

  const timeToDecimal = (timeStr: string): number => {
    if (typeof timeStr !== "string" || !timeStr.includes(":")) {
      return 0;
    }
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

  if (endDecimal < startDecimal) {
    endDecimal += 24;
  }

  const leftPercentage = (startDecimal / 24) * 100;
  const widthPercentage =
    ((Math.max(endDecimal, startDecimal) - startDecimal) / 24) * 100;

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

      <Card>
        <div className="mb-2">
          <TimelineComponent viewType="hours" day={new Date()} />
        </div>

        <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          <div
            className="absolute inset-y-0 bg-indigo-500 rounded flex items-center justify-center text-white text-xs font-medium shadow-inner"
            style={{
              left: `${Math.max(0, leftPercentage)}%`,
              width: `${Math.min(
                100 - Math.max(0, leftPercentage),
                widthPercentage
              )}%`,
              zIndex: 10,
            }}
            title={`${t("common.shift")}: ${startHour} - ${endHour}`}
          ></div>

          {Array.isArray(breaks) &&
            breaks.map((breakItem: IBreaks | null) => {
              if (
                !breakItem ||
                typeof breakItem.startTime !== "string" ||
                typeof breakItem.startTime !== "string"
              ) {
                return null;
              }

              const breakStartDecimal = timeToDecimal(breakItem.startTime);
              let breakEndDecimal = timeToDecimal(breakItem.endTime);

              if (breakEndDecimal < breakStartDecimal) {
                breakEndDecimal += 24;
              }
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
                    className="absolute inset-y-0 bg-sky-400/80 border-x border-sky-500/50 rounded-sm flex items-center justify-center text-white text-xs font-extralight"
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
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <Card title={t("shiftPage.infoTitle")}>
            <ShiftInfo {...shift} />
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6 lg:gap-8">
          <Card title={t("shiftPage.breaksTitle")}>
            <BreaksTable
              shiftId={parseInt(id)}
              breaks={
                Array.isArray(breaks)
                  ? (breaks.filter((b) => b !== null) as IBreaks[])
                  : []
              }
            />
          </Card>
          {Array.isArray(resources) && resources.length > 0 && (
            <Card title={t("shiftPage.resourcesTitle")}>
              <ResourcesTable
                resources={resources.filter((r) => r !== null) as IResource[]}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftPage;
