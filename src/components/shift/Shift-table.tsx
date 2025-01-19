import React from "react";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { IShift } from "../../graphql/interfaces";
import SearchBar from "../general/SearchBar";
import CreateShiftDialogBtn from "./CreateShiftDialogBtn";
import { Link } from "react-router";
import { useShifts } from "../../graphql/hook/shift";
import InfinityLoader from "../../components/general/Loader";
import ErrorComponent from "../../components/general/Error";
import { useLocation } from "react-router";
import Pagination, { itemsPerPage } from "../general/Pagination";

interface ShiftTableProps {
  t: (key: string, options?: any) => string;
}

const ShiftTable: React.FC<ShiftTableProps> = ({ t }) => {
  const { shifts, error, loading, reload } = useShifts();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  if (loading) {
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
  const filteredShifts = shifts.filter((shift: IShift) =>
    shift.name.toLowerCase().includes(query)
  );
  const { totalPages, data } = itemsPerPage(currentPage, filteredShifts);

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
          {data.map((shift: IShift) => (
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
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ShiftTable;
