import React from "react";
import { IBreaks } from "../../graphql/interfaces";

interface BreaksTableProps {
  breaks: IBreaks[];
  t: (key: string, options?: any) => string;
}

const BreaksTable: React.FC<BreaksTableProps> = ({ breaks, t }) => {
  return (
    <div className="p-4 border rounded shadow-md w-full">
      {breaks.length > 0 ? (
        <table className="w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">{t("break_name")}</th>
              <th className="border px-4 py-2 text-left">{t("break_start")}</th>
              <th className="border px-4 py-2 text-left">{t("break_end")}</th>
            </tr>
          </thead>
          <tbody>
            {breaks.map((breakItem) => (
              <tr key={breakItem.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{breakItem.name}</td>
                <td className="border px-4 py-2">{breakItem.startHour}</td>
                <td className="border px-4 py-2">{breakItem.endHour}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-500 py-4">
          <p>{t("no_breaks")}</p>
        </div>
      )}
    </div>
  );
};
export default BreaksTable;
