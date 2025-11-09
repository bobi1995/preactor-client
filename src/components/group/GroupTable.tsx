import React from "react";
import { IGroup } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import { CircleArrowRight, SquarePenIcon, Settings } from "lucide-react";
import { useNavigate } from "react-router";
import DeleteGroupDialog from "./DeleteGroupDialog";
import EditGroupDialog from "./EditGroupDialog";
import AssignedResourcesDialog from "./AssignedResourcesDialog";

interface GroupTableProps {
  groups: IGroup[];
  query: string;
}

const GroupTable: React.FC<GroupTableProps> = ({ groups, query }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const NoDataFallback: React.FC<{ children?: React.ReactNode }> = ({
    children,
  }) => (
    <span className="italic text-gray-500 text-xs">
      {children || t("common.notAvailable", "N/A")}
    </span>
  );

  const handleViewDetails = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="w-3/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.name")}
            </th>
            <th className="w-5/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("common.description")}
            </th>
            <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("groupsPage.resourceCount")}
            </th>
            <th className="w-2/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {groups.length === 0 ? (
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
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                  <p className="mt-3 text-base font-medium text-gray-500">
                    {query
                      ? t("groupsPage.noResultsFound")
                      : t("groupsPage.noGroupsAvailable")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {query
                      ? t("schedulesPage.tryDifferentKeywords")
                      : t("groupsPage.createNewPrompt")}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            groups.map((group: IGroup) => (
              <tr key={group.id} className="hover:bg-indigo-50/50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-base font-medium text-indigo-700">
                    {group.name}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-700 whitespace-normal break-words">
                  {group.description ? (
                    group.description
                  ) : (
                    <NoDataFallback>
                      {t("groupsPage.noDescriptionProvided")}
                    </NoDataFallback>
                  )}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-center">
                  <AssignedResourcesDialog group={group}>
                    <button
                      className="inline-flex items-center bg-indigo-100 text-indigo-700 font-semibold text-sm px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors cursor-pointer"
                      title={t(
                        "groupsPage.assignedResourcesDialog.triggerTitle"
                      )}
                    >
                      <Settings className="w-4 h-4 mr-1.5" />
                      {group.resourceLinks?.length || 0}
                    </button>
                  </AssignedResourcesDialog>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => handleViewDetails(group.id)}
                      title={t("groupsPage.viewDetails")}
                      className="text-gray-500 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-100"
                    >
                      <CircleArrowRight className="w-6 h-6" />
                    </button>
                    <EditGroupDialog group={group} allGroups={groups}>
                      <button
                        title={t("common.edit")}
                        className="p-1 rounded-full text-gray-500 hover:text-green-600"
                      >
                        <SquarePenIcon className="w-5 h-5" />
                      </button>
                    </EditGroupDialog>
                    <DeleteGroupDialog groupItem={group} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupTable;
