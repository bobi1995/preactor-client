import React from "react";
import { IResource } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import SearchBar from "../general/SearchBar";
import CreateDialogBtn from "./CreateDialogBtn";
// Updated imports for React Router v6+
import { Link, useNavigate, useLocation } from "react-router";
import { endpoint } from "../../../dbconfig";
import Pagination, { itemsPerPage } from "../general/Pagination";
import { Cog8ToothIcon } from "@heroicons/react/24/solid"; // Existing Machine Icon base
import {
  PencilSquareIcon,
  TrashIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline"; // Using outline icons for actions for variety

// Fallback icon for resources if no picture is available
const MachineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Cog8ToothIcon
    className={`w-full h-full text-gray-400 ${className}`} // Adjusted for parent div control
    aria-hidden="true"
  />
);

interface ResourceTableProps {
  resources: IResource[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  const { t } = useTranslation("resource");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const filteredResources = resources.filter((resource: IResource) =>
    resource.name.toLowerCase().includes(query)
  );

  const { totalPages, data } = itemsPerPage(currentPage, filteredResources);

  const NoDataFallback: React.FC<{ children?: React.ReactNode }> = ({
    children,
  }) => (
    <span className="italic text-gray-500 text-xs">
      {children || t("notAvailable", "N/A")}
    </span>
  );

  // --- Action Handlers (Dummy implementations) ---
  const handleViewDetails = (resourceId: string) => {
    navigate(`/resource/${resourceId}`);
  };

  const handleEdit = (resourceId: string) => {
    console.log("Edit resource:", resourceId);
    // navigate(`/resource/${resourceId}/edit`); // Or open a modal
  };

  const handleDelete = (resourceId: string) => {
    console.log("Delete resource:", resourceId);
    // Show confirmation dialog then call delete mutation
  };
  // --- End Action Handlers ---

  return (
    <div className="m-auto w-11/12 md:w-5/6 xl:w-3/4 py-6 px-1">
      <div className="mb-6 px-3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow w-full sm:w-auto">
            <SearchBar placeholder={t("searchByName", "Search by name...")} />
          </div>
          <CreateDialogBtn t={t} />
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th
                scope="col"
                className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {/* For Picture */}
              </th>
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
                {t("description", "Description")}
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
              >
                {t("schedule", "Schedule")}
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
                <td colSpan={5} className="px-6 py-12 text-center">
                  {" "}
                  {/* Adjusted colSpan */}
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-16 h-16 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      {/* Using a generic "empty box" icon */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </svg>
                    <p className="mt-3 text-base font-medium text-gray-500">
                      {query
                        ? t("noResultsFound", "No resources match your search.")
                        : t(
                            "noResourcesAvailable",
                            "No resources available yet."
                          )}
                    </p>
                    <p className="text-sm text-gray-400">
                      {query
                        ? t(
                            "tryDifferentKeywordsTable",
                            "Try adjusting your search."
                          )
                        : t(
                            "createNewResourcePromptTable",
                            "Create a new resource to get started!"
                          )}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((resource: IResource, index: number) => (
                <tr
                  key={resource.id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50/50"
                  } hover:bg-indigo-100/70 transition-colors duration-150 ease-in-out`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-gray-200 object-cover shadow-sm overflow-hidden flex items-center justify-center bg-gray-100">
                      {resource.picture ? (
                        <img
                          src={`${endpoint}/static/${resource.picture}`}
                          alt={resource.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Simple error handling: replace with fallback icon
                            const parent = (e.target as HTMLImageElement)
                              .parentNode;
                            if (parent) {
                              (e.target as HTMLImageElement).style.display =
                                "none"; // Hide broken img
                              // Check if fallback already exists to prevent duplicates
                              if (
                                !parent.querySelector(".fallback-icon-rendered")
                              ) {
                                const fallbackDiv =
                                  document.createElement("div");
                                fallbackDiv.className =
                                  "w-full h-full flex items-center justify-center fallback-icon-rendered";
                                fallbackDiv.innerHTML = `<svg class="w-7 h-7 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"></path></svg>`;
                                parent.appendChild(fallbackDiv);
                              }
                            }
                          }}
                        />
                      ) : (
                        <MachineIcon />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-base font-medium text-gray-900">
                      {resource.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs whitespace-normal break-words">
                    {resource.description ? (
                      resource.description
                    ) : (
                      <NoDataFallback>
                        {t("noDescriptionProvided", "No description provided")}
                      </NoDataFallback>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {resource.schedule?.name ? (
                      resource.schedule.name
                    ) : (
                      <NoDataFallback>
                        {t("noScheduleAssigned", "No schedule assigned")}
                      </NoDataFallback>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      <button
                        onClick={() => handleViewDetails(resource.id)}
                        title={t("viewDetails", "View Details")}
                        className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                      >
                        <ArrowRightCircleIcon className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleEdit(resource.id)}
                        title={t("editResource", "Edit Resource")}
                        className="text-gray-500 hover:text-green-600 transition-colors p-1 rounded-full hover:bg-green-100"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        title={t("deleteResource", "Delete Resource")}
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

export default ResourceTable;
