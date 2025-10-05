// src/components/shift/Shift-table.tsx

import React from "react";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import SearchBar from "../general/SearchBar";
import CreateShiftDialogBtn from "./CreateShiftDialogBtn";
import { useNavigate, useLocation } from "react-router";
import { useShifts } from "../../graphql/hook/shift";
import ErrorComponent from "../general/Error";
import Pagination, { itemsPerPage } from "../general/Pagination";
import { Clock, CircleArrowRight } from "lucide-react";
import EditShiftDialog from "./EditShiftDialog";
import DeleteShiftDialog from "./DeleteShiftDialog";
import LoadingDialog from "../general/LoadingDialog";

const ShiftTable: React.FC = () => {
  const { t } = useTranslation();
  const { shifts, error, loading, reload } = useShifts();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  if (error || (!shifts && !loading)) {
    return (
      <div className="m-auto w-11/12 md:w-3/4 lg:w-2/3 p-4 sm:p-6 text-center">
        <ErrorComponent
          message={t("shiftPage.unableToFetchShift")}
          onRetry={reload}
        />
      </div>
    );
  }

  const filteredShifts =
    shifts?.filter((shift: IShift) =>
      shift.name.toLowerCase().includes(query)
    ) || [];

  const { totalPages, data } = itemsPerPage(currentPage, filteredShifts);

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-3/4 py-6 px-1">
      <LoadingDialog isLoading={loading} />
      <div className="mb-6 ">
        <div className="flex flex-col sm:flex-row gap-4 ">
          <div className="flex-grow ">
            <SearchBar placeholder={t("shiftTable.searchShiftByName")} />
          </div>
          <CreateShiftDialogBtn allShifts={shifts || []} />
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("common.name")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("shiftTable.startHour")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("shiftTable.endHour")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider"
              >
                {t("common.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading && data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <p className="mt-3 text-base font-medium text-gray-500">
                      {query
                        ? t("shiftTable.noShiftsMatchSearch")
                        : t("shiftTable.noShiftsAvailable")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {query
                        ? t("shiftTable.tryDifferentKeywords")
                        : t("shiftTable.createNewPrompt")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((shift: IShift, index: number) => (
                <tr
                  key={shift.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/50"
                  } hover:bg-indigo-100/70 transition-colors duration-150 ease-in-out`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-base font-medium text-indigo-700">
                      {shift.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                      {shift.startHour.slice(0, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-purple-400" />
                      {shift.endHour.slice(0, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => navigate(`/shift/${shift.id}`)}
                        title={t("shiftTable.viewDetails")}
                        className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                      >
                        <CircleArrowRight className="w-5 h-5" />
                      </button>

                      <EditShiftDialog
                        shift={shift}
                        onSuccess={reload}
                        allShifts={shifts || []}
                      />

                      <DeleteShiftDialog
                        shiftId={shift.id}
                        shiftName={shift.name}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default ShiftTable;
