import React from "react";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { IResource } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";
import SearchBar from "../general/SearchBar";
import CreateDialogBtn from "./CreateDialogBtn";
import { Link } from "react-router";
import { endpoint } from "../../../dbconfig";
import { useLocation } from "react-router";
import Pagination, { itemsPerPage } from "../general/Pagination";

interface ResourceTableProps {
  resources: IResource[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  const { t } = useTranslation("resource");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const filteredResources = resources.filter((resource: IResource) =>
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
            <th className="px-6 py-4 text-left">{t("schedule")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((resource: IResource) => (
            <tr
              key={resource.id}
              className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
            >
              <td className="px-6 py-5 text-left">
                <img
                  src={`${endpoint}/static/${resource.picture}`}
                  alt={resource.name}
                  className="w-12 h-12  rounded-full border border-gray-300 shadow-md"
                />
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                <Link
                  to={`/resource/${resource.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {resource.name}
                </Link>
              </td>
              <td className="px-6 py-5 text-gray-700 text-sm">
                {resource.description}
              </td>
              <td className="px-6 py-5 text-gray-700 text-sm">
                {resource.schedule?.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ResourceTable;
