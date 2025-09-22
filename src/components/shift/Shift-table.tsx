import React from "react";
import { useTranslation } from "react-i18next";
import { IShift } from "../../graphql/interfaces";
import SearchBar from "../general/SearchBar";
import CreateShiftDialogBtn from "./CreateShiftDialogBtn";
import { useNavigate, useLocation } from "react-router"; // Corrected import
import { useShifts } from "../../graphql/hook/shift";
import InfinityLoader from "../../components/general/Loader";
import ErrorComponent from "../../components/general/Error";
import Pagination, { itemsPerPage } from "../general/Pagination";
import { timesToRepresentativeString } from "../../utils/time-converters";
import { Clock, CircleArrowRight } from "lucide-react";
import EditShiftDialog from "./EditShiftDialog";
import DeleteShiftDialog from "./DeleteShiftDialog";

const ShiftTable: React.FC = () => {
  const { t } = useTranslation();
  const { shifts, error, loading, reload } = useShifts();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const handleViewDetails = (shiftId: number) => {
    navigate(`/shift/${shiftId}`);
  };

  const handleDelete = (shiftId: number) => {
    console.log("Delete shift:", shiftId);
  };
  // --- End Action Handlers ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <InfinityLoader />
      </div>
    );
  }

  if (error || !shifts) {
    return (
      <div className="m-auto w-11/12 md:w-3/4 lg:w-2/3 p-4 sm:p-6 text-center">
        <ErrorComponent
          // Updated translation key
          message={t("shiftPage.unableToFetchShift", "Unable to fetch shifts.")}
          onRetry={() => reload()}
        />
      </div>
    );
  }

  const filteredShifts = shifts.filter((shift: IShift) =>
    shift.name.toLowerCase().includes(query)
  );

  const { totalPages, data } = itemsPerPage(currentPage, filteredShifts);

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-3/4 py-6 px-1">
      <div className="mb-6 ">
        <div className="flex flex-col sm:flex-row gap-4 ">
          <div className="flex-grow ">
            <SearchBar
              // Updated translation key
              placeholder={t(
                "shiftTable.searchShiftByName",
                "Search by shift name..."
              )}
            />
          </div>
          {/* No longer passing `t` prop */}
          <CreateShiftDialogBtn />
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
                {t("common.name", "Name")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("shiftTable.startHour", "Start Time")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("shiftTable.endHour", "End Time")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider"
              >
                {t("common.actions", "Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-16 h-16 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="mt-3 text-base font-medium text-gray-500">
                      {query
                        ? t(
                            "shiftTable.noShiftsMatchSearch",
                            "No shifts match your search."
                          )
                        : t(
                            "shiftTable.noShiftsAvailable",
                            "No shifts available yet."
                          )}
                    </p>
                    <p className="text-sm text-gray-400">
                      {/* Assuming these keys exist in shiftTable namespace */}
                      {query
                        ? t(
                            "shiftTable.tryDifferentKeywords",
                            "Try adjusting your search."
                          )
                        : t(
                            "shiftTable.createNewPrompt",
                            "Create a new shift to get started!"
                          )}
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
                    <span className="text-base font-medium text-indigo-700 hover:text-indigo-900">
                      {shift.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center text-sm">
                      <Clock className="w-5 h-5 mr-2 text-indigo-400" />
                      {timesToRepresentativeString(shift.startHour)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center text-sm">
                      <Clock className="w-5 h-5 mr-2 text-purple-400" />
                      {timesToRepresentativeString(shift.endHour)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleViewDetails(shift.id)}
                        title={t("shiftTable.viewDetails", "View Details")}
                        className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                      >
                        <CircleArrowRight className="w-5 h-5" />
                      </button>

                      <EditShiftDialog shift={shift} />
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
