import React from "react";
import { useTranslation } from "react-i18next";
import { IChangeoverGroup } from "../../graphql/interfaces";
import { Layers } from "lucide-react";
import EditChangeoverGroupDialog from "./EditChangeoverGroupDialog";
import DeleteChangeoverGroupDialog from "./DeleteChangeoverGroupDialog";
import GroupTimesDialog from "./GroupTimeDialog";

interface Props {
  groups: IChangeoverGroup[];
  query: string;
}

const ChangeoverGroupsTable: React.FC<Props> = ({ groups, query }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="w-6/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("changeoverGroupsPage.table.name", "Name")}
            </th>
            {/* Added Column for Times */}
            <th className="w-3/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("changeoverGroupsPage.table.times", "Configuration")}
            </th>
            <th className="w-3/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions", "Actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {groups.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Layers className="w-16 h-16 text-gray-300" />
                  <p className="mt-3 text-base font-medium text-gray-500">
                    {query
                      ? t("changeoverGroupsPage.table.noMatch")
                      : t("changeoverGroupsPage.table.noData")}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr key={group.id} className="hover:bg-indigo-50/50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-base font-medium text-indigo-700 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    {group.name}
                  </span>
                </td>
                {/* Added Button */}
                <td className="px-6 py-3 whitespace-nowrap text-center">
                  <GroupTimesDialog group={group} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-center space-x-3">
                    <EditChangeoverGroupDialog
                      group={group}
                      allGroups={groups}
                    />
                    <DeleteChangeoverGroupDialog group={group} />
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

export default ChangeoverGroupsTable;
