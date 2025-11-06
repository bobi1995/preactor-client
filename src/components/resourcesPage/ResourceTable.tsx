import React, { useState } from "react";
import { IResource } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { endpoint } from "../../../dbconfig";
import { Settings, CircleArrowRight, SquarePenIcon } from "lucide-react";
import ScheduleLink from "../general/links/ScheduleLink";
import DeleteResourceDialog from "./DeleteResourceDialog";
import EditResourceDialog from "./EditResourceDialog";

const MachineIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Settings
    className={`w-full h-full text-gray-400 ${className}`}
    aria-hidden="true"
  />
);

const ResourceImage: React.FC<{ picture?: string | null; name: string }> = ({
  picture,
  name,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!picture || hasError) {
    return <MachineIcon />;
  }

  return (
    <img
      src={`${endpoint}/static/${picture}`}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
};

interface ResourceTableProps {
  resources: IResource[];
  query: string;
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources, query }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const NoDataFallback: React.FC<{ children?: React.ReactNode }> = ({
    children,
  }) => (
    <span className="italic text-gray-500 text-xs">
      {children || t("common.notAvailable", "N/A")}
    </span>
  );

  const handleViewDetails = (resourceId: string) => {
    navigate(`/resource/${resourceId}`);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="w-3/12 px-3 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.name")}
            </th>
            <th className="w-4/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.description")}
            </th>
            <th className="w-1/12 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("resourceTable.externalCode")}
            </th>
            <th className="w-2/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.schedule")}
            </th>
            <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {resources.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center">
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                  <p className="mt-3 text-base font-medium text-gray-500">
                    {/* Use the 'query' prop */}
                    {query
                      ? t("resourceTable.noResultsFound")
                      : t("resourceTable.noResourcesAvailable")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {query
                      ? t("schedulesPage.tryDifferentKeywords")
                      : t("resourceTable.createNewResourcePromptTable")}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            resources.map((resource: IResource) => (
              <tr key={resource.id} className="hover:bg-indigo-50/50">
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0">
                      <ResourceImage
                        picture={resource.picture}
                        name={resource.name}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.color ? (
                        <div
                          className="w-4 h-4 rounded border border-gray-300 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: resource.color }}
                          title={resource.color}
                        />
                      ) : (
                        <div
                          className="w-4 h-4 rounded border border-gray-300 shadow-sm bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0"
                          title={t("resourceTable.noColorAssigned")}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-500 text-[8px]">—</span>
                          </div>
                        </div>
                      )}
                      <span className="text-base font-medium text-indigo-700">
                        {resource.name}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-700 whitespace-normal break-words">
                  {resource.description ? (
                    resource.description
                  ) : (
                    <NoDataFallback>
                      {t("resourceTable.noDescriptionProvided")}
                    </NoDataFallback>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {resource.externalCode ? (
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {resource.externalCode}
                    </span>
                  ) : (
                    <NoDataFallback>
                      {t("resourceTable.noExternalCode")}
                    </NoDataFallback>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
                  {resource.schedule?.name ? (
                    <ScheduleLink
                      scheduleId={resource.schedule.id}
                      scheduleName={resource.schedule.name}
                    />
                  ) : (
                    <NoDataFallback>
                      {t("resourceTable.noScheduleAssigned")}
                    </NoDataFallback>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(resource.id)}
                      title={t("resourceTable.viewDetails")}
                      className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                    >
                      <CircleArrowRight className="w-6 h-6" />
                    </button>
                    <EditResourceDialog
                      resource={resource}
                      allResources={resources}
                    >
                      <button
                        title={t("common.edit")}
                        className="p-1 rounded-full text-gray-500 hover:text-green-600"
                      >
                        <SquarePenIcon className="w-5 h-5" />
                      </button>
                    </EditResourceDialog>
                    <DeleteResourceDialog resourceItem={resource} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* REMOVED: Pagination block */}
    </div>
  );
};

export default ResourceTable;
