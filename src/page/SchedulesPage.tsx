// src/page/SchedulesPage.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useSchedules, useDeleteSchedule } from "../graphql/hook/schedule";
import { ISchedule } from "../graphql/interfaces";
import SearchBar from "../components/general/SearchBar";
import ErrorComponent from "../components/general/Error";
import LoadingDialog from "../components/general/LoadingDialog";
import CreateScheduleDialog from "../components/schedulesPage/CreateScheduleDialog"; // Updated path
import SchedulesTable from "../components/schedulesPage/SchedulesTable"; // Updated path
import Pagination, { itemsPerPage } from "../components/general/Pagination";

const SchedulesPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { schedules, loading, error, reload } = useSchedules();
  const { remove: deleteSchedule } = useDeleteSchedule();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  if (error) return <ErrorComponent message={error.message} onRetry={reload} />;

  const filteredSchedules = schedules.filter((s: ISchedule) =>
    s.name.toLowerCase().includes(query)
  );
  const { totalPages, data: paginatedSchedules } = itemsPerPage(
    currentPage,
    filteredSchedules
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      // No reload() needed if refetchQueries is working in the hook
    } catch (e: any) {
      if (e.message === "SCHEDULE_IN_USE") {
        alert(t("schedulesPage.deleteErrorInUse"));
      } else {
        alert(t("common.errorGeneral"));
      }
      throw e;
    }
  };

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-full py-6 px-4">
      <LoadingDialog isLoading={loading} />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">
          {t("schedulesPage.title")}
        </h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="flex-grow sm:max-w-xs">
            <SearchBar placeholder={t("schedulesPage.searchPlaceholder")} />
          </div>
          <CreateScheduleDialog />
        </div>
      </div>

      <SchedulesTable
        schedules={paginatedSchedules}
        query={query}
        onDelete={handleDelete}
      />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default SchedulesPage;
