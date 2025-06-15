import React from "react";
import { IResource } from "../../graphql/interfaces";
import { endpoint } from "../../../dbconfig";
import { useTranslation } from "react-i18next";

interface BreaksTableProps {
  resources: IResource[];
}

const ResourcesTable: React.FC<BreaksTableProps> = ({ resources }) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 border rounded shadow-md w-full">
      {resources.length > 0 ? (
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">{t("resource")}</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 flex gap-4 items-center">
                  <img
                    src={`${endpoint}/static/${resource.picture}`}
                    alt={resource.name}
                    className="w-12 h-12 rounded-full border border-gray-300 shadow-md"
                  />
                  <p className="text-lg">{resource.name}</p>
                </td>
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
