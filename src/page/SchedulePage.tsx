import React, { useState, useEffect, useMemo } from "react";
import { useParams, useBlocker } from "react-router";
import { useTranslation } from "react-i18next";
import { useSchedule, useUpdateSchedule } from "../graphql/hook/schedule";
import { useShifts } from "../graphql/hook/shift";
import { IShift, ISchedule } from "../graphql/interfaces";
import DayShiftSelector from "../components/schedulePage/DayShiftSelector";
import LoadingDialog from "../components/general/LoadingDialog";
import ErrorComponent from "../components/general/Error";
import UnsavedChangesDialog from "../components/general/UnsavedChangesDialog";
import WeeklyTimeline from "../components/general/gant/WeeklyTimeline"; // 1. Import the new component
import { Save } from "lucide-react";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
const weekDays: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const SchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(["translation", "common"]);

  const { schedule, loading: scheduleLoading, error } = useSchedule(Number(id));
  const { shifts, loading: shiftsLoading } = useShifts();
  const { updateSchedule, loading: isSaving } = useUpdateSchedule();

  const [currentSchedule, setCurrentSchedule] = useState<ISchedule | null>(
    null
  );
  const [originalSchedule, setOriginalSchedule] = useState<ISchedule | null>(
    null
  );

  useEffect(() => {
    if (schedule) {
      setCurrentSchedule(schedule);
      setOriginalSchedule(schedule);
    }
  }, [schedule]);

  const isDirty = useMemo(() => {
    if (!originalSchedule || !currentSchedule) return false;
    return weekDays.some(
      (day) => originalSchedule[day]?.id !== currentSchedule[day]?.id
    );
  }, [originalSchedule, currentSchedule]);

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = t("scheduleBuilder.unsavedChangesWarning");
        return t("scheduleBuilder.unsavedChangesWarning");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, t]);

  const handleShiftChange = (dayId: DayKey, shiftId: string | null) => {
    const selectedShift = shiftId
      ? shifts.find((s: IShift) => s.id.toString() === shiftId)
      : null;
    setCurrentSchedule((prev: any) => ({ ...prev, [dayId]: selectedShift }));
  };

  const handleSave = async () => {
    if (!currentSchedule || !id) return;
    const input = {
      name: currentSchedule.name,
      mondayId: currentSchedule.monday?.id || null,
      tuesdayId: currentSchedule.tuesday?.id || null,
      wednesdayId: currentSchedule.wednesday?.id || null,
      thursdayId: currentSchedule.thursday?.id || null,
      fridayId: currentSchedule.friday?.id || null,
      saturdayId: currentSchedule.saturday?.id || null,
      sundayId: currentSchedule.sunday?.id || null,
    };
    try {
      await updateSchedule(id, input);
      setOriginalSchedule(currentSchedule);
    } catch (e) {
      console.error("Failed to save schedule", e);
    }
  };

  const isLoading = scheduleLoading || shiftsLoading;
  if (error) return <ErrorComponent message={error.message} />;

  return (
    <div className="w-full py-6 px-4 space-y-8">
      <LoadingDialog isLoading={isLoading || isSaving} />

      {blocker.state === "blocked" && (
        <UnsavedChangesDialog
          isOpen={true}
          onConfirm={() => blocker.proceed?.()}
          onCancel={() => blocker.reset?.()}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("scheduleBuilder.title")}:{" "}
          <span className="text-indigo-600">{currentSchedule?.name}</span>
        </h1>
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2.5 text-sm flex items-center gap-2 shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>{t("scheduleBuilder.savingButton")}</>
          ) : (
            <>
              <Save size={18} /> {t("scheduleBuilder.saveButton")}
            </>
          )}
        </button>
      </div>

      {/* 2. The Day Shift Selectors are at the top */}
      {!isLoading && currentSchedule && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {weekDays.map((day) => (
            <DayShiftSelector
              key={day}
              dayId={day}
              dayName={t(`common.days.${day}`)}
              shifts={shifts}
              selectedShiftId={currentSchedule[day]?.id?.toString() || null}
              isModified={
                originalSchedule?.[day]?.id !== currentSchedule[day]?.id
              }
              onShiftChange={handleShiftChange}
            />
          ))}
        </div>
      )}

      {/* 3. The new Gantt Chart is now at the bottom, visualizing the current state */}
      {!isLoading && currentSchedule && (
        <WeeklyTimeline schedule={currentSchedule} />
      )}
    </div>
  );
};

export default SchedulePage;
