import React from "react";
import { useTranslation } from "react-i18next";
import { IAttribute } from "../../graphql/interfaces";
import { Tag } from "lucide-react";
import EditAttributeDialog from "./EditAttributeDialog";
import DeleteAttributeDialog from "./DeleteAttributeDialog";
import AttributeParametersDialog from "./AttributeParametersDialog";

interface Props {
  attributes: IAttribute[];
  query: string;
}

const AttributesTable: React.FC<Props> = ({ attributes, query }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
      <table className="min-w-full table-fixed">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <tr>
            <th className="w-5/12 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              {t("attributesPage.table.name", "Name")}
            </th>
            <th className="w-4/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("attributesPage.table.parameters", "Parameters")}
            </th>
            <th className="w-3/12 px-6 py-3 text-center text-sm font-semibold uppercase tracking-wider">
              {t("common.actions", "Actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {attributes.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Tag className="w-16 h-16 text-gray-300" />
                  <p className="mt-3 text-base font-medium text-gray-500">
                    {query
                      ? t("attributesPage.table.noMatch")
                      : t("attributesPage.table.noData")}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            attributes.map((attr) => (
              <tr key={attr.id} className="hover:bg-indigo-50/50">
                <td className="px-6 py-3 whitespace-nowrap">
                  <span className="text-base font-medium text-indigo-700 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {attr.name}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-center">
                  {/* This mirrors AssignedShiftsDialog */}
                  {attr.isParam ? (
                    <AttributeParametersDialog attribute={attr} />
                  ) : null}
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-center space-x-3">
                    <EditAttributeDialog
                      attribute={attr}
                      allAttributes={attributes}
                    />
                    <DeleteAttributeDialog attribute={attr} />
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

export default AttributesTable;
