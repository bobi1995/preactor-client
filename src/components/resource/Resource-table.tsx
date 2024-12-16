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

interface ResourceTableProps {
  resources: IResource[];
}

const ResourceTable: React.FC<ResourceTableProps> = ({ resources }) => {
  const { t } = useTranslation("resource");
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
            <th className="px-6 py-4 text-left">{t("color")}</th>
            <th className="px-6 py-4 text-left">{t("name")}</th>
            <th className="px-6 py-4 text-left">{t("description")}</th>
            <th className="px-6 py-4 text-left">{t("shift")}</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr
              key={resource.id}
              className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
            >
              <td className="px-6 py-5 text-left">
                <span
                  style={{
                    display: "inline-block",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: `${resource.color}`,
                  }}
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
                {resource.regularShiftId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourceTable;
