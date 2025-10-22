import React from "react";
import { IShift } from "../../../graphql/interfaces";
import { useShifts } from "../../../graphql/hook/shift";

interface ShiftSelectProps {
  t: (key: string, options?: any) => string;
  selectedShift: string;
  setSelectedShift: React.Dispatch<React.SetStateAction<string>>;
}

const ShiftSelect: React.FC<ShiftSelectProps> = ({
  t,
  selectedShift,
  setSelectedShift,
}) => {
  const { shifts, error, loading, reload } = useShifts();

  return (
    <select
      value={selectedShift}
      onChange={(e) => setSelectedShift(e.target.value)}
      className="border border-gray-300 rounded p-2"
    >
      <option value="">{t("no_shift")}</option>
      {shifts &&
        shifts.map((shift: IShift) => (
          <option key={shift.id} value={shift.id}>
            {shift.name}
          </option>
        ))}
    </select>
  );
};

export default ShiftSelect;
