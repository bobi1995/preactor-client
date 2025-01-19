import React, { useState } from "react";
import { ISchedule, IShift } from "../../graphql/interfaces";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { useShifts } from "../../graphql/hook/shift";
import InfinityLoader from "../general/Loader";
import ErrorComponent from "../general/Error";
import { useUpdateSchedule } from "../../graphql/hook/schedule";

interface DaysTableProps {
  t: (key: string, options?: any) => string;
  schedule: ISchedule;
}

const SelectShift: React.FC<{
  shifts: IShift[];
  selectedShiftId: string;
  onChange: (shiftId: string) => void;
  t: (key: string, options?: any) => string;
}> = ({ shifts, selectedShiftId, onChange, t }) => {
  return (
    <select
      value={selectedShiftId}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded p-2"
    >
      <option value="">{t("no_shift")}</option>
      {shifts.map((shift) => (
        <option key={shift.id} value={shift.id}>
          {shift.name}
        </option>
      ))}
    </select>
  );
};

const DaysTable: React.FC<DaysTableProps> = ({ t, schedule }) => {
  const { shifts, error, loading, reload } = useShifts();
  const { update, loading: updateLoading } = useUpdateSchedule();

  const [selectedShifts, setSelectedShifts] = useState({
    monday: schedule.monday?.id || "",
    tuesday: schedule.tuesday?.id || "",
    wednesday: schedule.wednesday?.id || "",
    thursday: schedule.thursday?.id || "",
    friday: schedule.friday?.id || "",
    saturday: schedule.saturday?.id || "",
    sunday: schedule.sunday?.id || "",
  });

  if (loading || updateLoading) {
    return <InfinityLoader />;
  }
  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch shifts. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }

  const handleShiftChange = (day: string, shiftId: string) => {
    setSelectedShifts((prevState) => ({
      ...prevState,
      [day]: shiftId,
    }));
    console.log(`Shift for ${day} changed to ${shiftId}`);
  };

  const handleSave = async () => {
    await update(schedule.id, {
      name: schedule.name,
      mondayShiftId: selectedShifts.monday,
      tuesdayShiftId: selectedShifts.tuesday,
      wednesdayShiftId: selectedShifts.wednesday,
      thursdayShiftId: selectedShifts.thursday,
      fridayShiftId: selectedShifts.friday,
      saturdayShiftId: selectedShifts.saturday,
      sundayShiftId: selectedShifts.sunday,
    });
    window.location.reload();
  };

  return (
    <div className="mt-10">
      <h1 className="text-center text-2xl font-bold">{schedule.name}</h1>
      <div className="overflow-x-auto shadow-md rounded-lg p-2 ">
        <table
          className={`${table} border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2`}
        >
          <thead className={`${thead} bg-gray-100`}>
            <tr className={classRowHeader}>
              <th className="px-6 py-4 text-left">{t("monday")}</th>
              <th className="px-6 py-4 text-left">{t("tuesday")}</th>
              <th className="px-6 py-4 text-left">{t("wednesday")}</th>
              <th className="px-6 py-4 text-left">{t("thursday")}</th>
              <th className="px-6 py-4 text-left">{t("friday")}</th>
              <th className="px-6 py-4 text-left">{t("saturday")}</th>
              <th className="px-6 py-4 text-left">{t("sunday")}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              key={schedule.id}
              className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
            >
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.monday}
                  onChange={(shiftId) => handleShiftChange("monday", shiftId)}
                  t={t}
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.tuesday}
                  onChange={(shiftId) => handleShiftChange("tuesday", shiftId)}
                  t={t}
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.wednesday}
                  onChange={(shiftId) =>
                    handleShiftChange("wednesday", shiftId)
                  }
                  t={t}
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.thursday}
                  onChange={(shiftId) => handleShiftChange("thursday", shiftId)}
                  t={t}
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.friday}
                  onChange={(shiftId) => handleShiftChange("friday", shiftId)}
                  t={t}
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.saturday}
                  onChange={(shiftId) => handleShiftChange("saturday", shiftId)}
                  t={t}
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <SelectShift
                  shifts={shifts}
                  selectedShiftId={selectedShifts.sunday}
                  onChange={(shiftId) => handleShiftChange("sunday", shiftId)}
                  t={t}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="bg-blue-600 text-white rounded-md px-4 py-2"
          onClick={handleSave}
          disabled={loading}
        >
          {t("save")}
        </button>
      </div>
    </div>
  );
};

export default DaysTable;
