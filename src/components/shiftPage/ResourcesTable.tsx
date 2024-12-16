import React from "react";
import { IResource } from "../../graphql/interfaces";
import { useTranslation } from "react-i18next";

interface BreaksTableProps {
  resources: IResource[];
}

const ResourcesTable: React.FC<BreaksTableProps> = ({ resources }) => {
  const { t } = useTranslation("resource");

  return (
    <div className="p-4 border rounded shadow-md w-full">
      {resources.length > 0 ? (
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">
                {t("resource_pic")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("resource_name")}
              </th>
              <th className="border px-4 py-2 text-left">
                {t("resource_desc")}
              </th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{resource.picture}</td>
                <td className="border px-4 py-2">{resource.name}</td>
                <td className="border px-4 py-2">{resource.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 py-4">
          <p>{t("no_resources")}</p>
        </div>
      )}
    </div>
  );
};
export default ResourcesTable;
