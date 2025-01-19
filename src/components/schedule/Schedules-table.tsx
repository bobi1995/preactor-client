import React from "react";
import { useSchedules } from "../../graphql/hook/schedule";
import InfinityLoader from "../../components/general/Loader";
import ErrorComponent from "../../components/general/Error";
import SearchBar from "../general/SearchBar";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { ISchedule } from "../../graphql/interfaces";
import { Link } from "react-router";
import CreateScheduleDialog from "./CreateScheduleDialog";
import { useLocation } from "react-router";
import Pagination, { itemsPerPage } from "../general/Pagination";
import MassShiftDialog from "./MassShiftDialog";

interface SchedulesTableProps {
  t: (key: string, options?: any) => string;
}
const SchedulesTable: React.FC<SchedulesTableProps> = ({ t }) => {
  const { schedules, error, loading, reload } = useSchedules();
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
        message="Unable to fetch schedules. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }

  const filteredSchedules = schedules.filter((schedule: ISchedule) =>
    schedule.name.toLowerCase().includes(query)
  );

  const { totalPages, data } = itemsPerPage(currentPage, filteredSchedules);

  return (
    <div className="m-auto w-3/4 bg-white shadow-md rounded-lg p-2 mt-10">
      <div className="flex gap-2">
        <SearchBar placeholder={t("search_schedule")} />
        <MassShiftDialog t={t} />
        <CreateScheduleDialog t={t} />
      </div>
      <div className="overflow-x-auto">
        <table
          className={`${table} border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2`}
        >
          <thead className={`${thead} bg-gray-100`}>
            <tr className={classRowHeader}>
              <th className="px-6 py-4 text-left">{t("name")}</th>
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
            {data.map((schedule: ISchedule) => (
              <tr
                key={schedule.id}
                className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
              >
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  <Link
                    to={`/schedule/${schedule.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {schedule.name}
                  </Link>
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.monday?.name}
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.tuesday?.name}
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.wednesday?.name}
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.thursday?.name}
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.friday?.name}
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.saturday?.name}
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  {schedule.sunday?.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default SchedulesTable;
