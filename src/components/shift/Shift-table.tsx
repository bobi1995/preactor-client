import React from "react";
import { IShift } from "../../graphql/interfaces";
import SearchBar from "../general/SearchBar";
import CreateShiftDialogBtn from "./CreateShiftDialogBtn";
import { Link, useNavigate, useLocation } from "react-router"; // Assuming react-router-dom v6+ for useNavigate
// If you are on an older react-router, you might use `useHistory` or pass router props.
// For react-router < v6, Link is fine as is.
import { useShifts } from "../../graphql/hook/shift";
import InfinityLoader from "../../components/general/Loader";
import ErrorComponent from "../../components/general/Error";
import Pagination, { itemsPerPage } from "../general/Pagination";

// --- Icons ---
// You can replace these with your preferred icon library (e.g., Heroicons, FontAwesome)
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PencilSquareIcon: React.FC<{ className?: string }> = (
  { className } // Edit
) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
    />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = (
  { className } // Delete
) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.032 3.287.094M5.116 5.79l-.037-.014M10.5 11.25v5.25m3-5.25v5.25m5.25-10.125c.38-.047.76-.082 1.148-.11M5.116 5.79c.326-.022.658-.029 1.008-.029m11.07 0c.36.004.707.018 1.044.041"
    />
  </svg>
);

const ArrowRightCircleIcon: React.FC<{ className?: string }> = (
  { className } // View Details / Open
) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
// --- End Icons ---

interface ShiftTableProps {
  t: (key: string, options?: any) => string;
}

const ShiftTable: React.FC<ShiftTableProps> = ({ t }) => {
  const { shifts, error, loading, reload } = useShifts();
  const location = useLocation(); // from react-router-dom
  const navigate = useNavigate(); // from react-router-dom v6+

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // --- Action Handlers (Dummy implementations) ---
  const handleViewDetails = (shiftId: number) => {
    navigate(`/shift/${shiftId}`); // Navigate to detail page
  };

  const handleEdit = (shiftId: number) => {
    console.log("Edit shift:", shiftId);
    // navigate(`/shift/${shiftId}/edit`); // Or open a modal
  };

  const handleDelete = (shiftId: number) => {
    console.log("Delete shift:", shiftId);
    // Show confirmation dialog then call delete mutation
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
          message={t("unableToFetchShifts", "Unable to fetch shifts.")}
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
      <div className="mb-6 px-3">
        <div className="flex flex-col sm:flex-row gap-4 ">
          <div className="flex-grow w-full sm:w-auto">
            <SearchBar
              placeholder={t("searchShiftByName", "Search by shift name...")}
            />
          </div>
          <CreateShiftDialogBtn t={t} />
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
                {t("name", "Name")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("startHour", "Start Time")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("endHour", "End Time")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider"
              >
                {t("actions", "Actions")}
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
                            "noShiftsMatchSearch",
                            "No shifts match your search."
                          )
                        : t("noShiftsAvailable", "No shifts available yet.")}
                    </p>
                    <p className="text-sm text-gray-400">
                      {query
                        ? t(
                            "tryDifferentKeywordsTable",
                            "Try adjusting your search."
                          )
                        : t(
                            "createNewShiftPromptTable",
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
                      <ClockIcon className="w-5 h-5 mr-2 text-indigo-400" />
                      {shift.startHour}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center text-sm">
                      <ClockIcon className="w-5 h-5 mr-2 text-purple-400" />
                      {shift.endHour}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => handleViewDetails(shift.id)}
                        title={t("viewDetails", "View Details")}
                        className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                      >
                        <ArrowRightCircleIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleEdit(shift.id)}
                        title={t("editShift", "Edit Shift")}
                        className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-100"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(shift.id)}
                        title={t("deleteShift", "Delete Shift")}
                        className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
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
