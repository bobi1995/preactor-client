import React, { useState } from "react";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { IGroup } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import SearchBar from "../general/SearchBar";
import CreateDialogBtn from "./CreateGroupBtn";
import { Link } from "react-router";
import { useLocation } from "react-router";
import Pagination, { itemsPerPage } from "../general/Pagination";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

interface GroupTableProps {
  groups: IGroup[];
}

const GroupTable: React.FC<GroupTableProps> = ({ groups }) => {
  const { t } = useTranslation("group");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (groupId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const filteredResources = groups.filter((resource: IGroup) =>
    resource.name.toLowerCase().includes(query)
  );

  const { totalPages, data } = itemsPerPage(currentPage, filteredResources);

  return (
    <div className="m-auto w-3/4  bg-white shadow-md rounded-lg p-2">
      <div className="flex gap-2">
        <SearchBar placeholder={t("search")} />
        <CreateDialogBtn t={t} />
      </div>
      <table
        className={`${table} border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2`}
      >
        <thead className={`${thead} bg-gray-100`}>
          <tr className={classRowHeader}>
            <th className="px-6 py-4 text-left"></th>

            <th className="px-6 py-4 text-left">{t("name")}</th>
            <th className="px-6 py-4 text-left">{t("description")}</th>
            <th className="px-6 py-4 text-left">{t("count_res")}</th>
            <th className="px-6 py-4 text-left">{t("add")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((group: IGroup) => (
            <React.Fragment key={group.id}>
              <tr
                className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
              >
                <td className="px-6 py-5 text-gray-700 text-sm">
                  <button onClick={() => toggleRow(group.id)}>
                    {expandedRows.has(group.id) ? "▲" : "▼"}
                  </button>
                </td>
                <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                  <Link
                    to={`/group/${group.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {group.name}
                  </Link>
                </td>
                <td className="px-6 py-5 text-gray-700 text-sm">
                  {group.description}
                </td>
                <td className="px-6 py-5 text-gray-700 text-sm">
                  {group.resources.length}
                </td>
                <td className="px-6 py-5 text-gray-700 text-sm">
                  <PlusCircleIcon className="h-6 w-6" />
                </td>
              </tr>
              {expandedRows.has(group.id) && (
                <tr>
                  <td colSpan={4} className="px-6 py-5">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      {group.resources.map((resource) => (
                        <div key={resource.id} className="mb-2">
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-sm text-gray-600">
                            {resource.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default GroupTable;
