import React from "react";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { IShift } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import SearchBar from "../general/SearchBar";
import CreateShiftDialogBtn from "./CreateShiftDialogBtn";
import { Link } from "react-router";

interface ShiftTableProps {
  shift: IShift[];
}

const ShiftTable: React.FC<ShiftTableProps> = ({ shift }) => {
  const { t } = useTranslation("resource");
  return (
    <div className="m-auto w-3/4  bg-white shadow-md rounded-lg p-2">
      <div className="flex gap-2">
        <SearchBar placeholder={t("search_shift")} />
        <CreateShiftDialogBtn t={t} />
      </div>
      <table
        className={`${table} border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2`}
      >
        <thead className={`${thead} bg-gray-100`}>
          <tr className={classRowHeader}>
            <th className="px-6 py-4 text-left">{t("name")}</th>
            <th className="px-6 py-4 text-left">{t("start")}</th>
            <th className="px-6 py-4 text-left">{t("end")}</th>
          </tr>
        </thead>
        <tbody>
          {shift.map((shift) => (
            <tr
              key={shift.id}
              className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
            >
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <Link
                  to={`/shift/${shift.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {shift.name}
                </Link>
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                {shift.startHour}
              </td>
              <td className="px-6 py-5 text-gray-700 text-sm">
                {shift.endHour}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftTable;
