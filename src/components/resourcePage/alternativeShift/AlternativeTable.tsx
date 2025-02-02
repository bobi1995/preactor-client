import React from "react";

interface AlternativeTableProps {
  alternatives: {
    id: string;
    startDate: string;
    endDate: string;
    shiftId: string;
  }[];
  t: (key: string, options?: any) => string;
}

const AlternativeTable: React.FC<AlternativeTableProps> = ({
  alternatives,
  t,
}) => {
  return (
    <table className="w-full table-auto border-collapse text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-4 py-2 text-left">{t("break_start")}</th>
          <th className="border px-4 py-2 text-left">{t("break_end")}</th>
        </tr>
      </thead>
      <tbody>
        {alternatives.map((alt) => (
          <tr key={alt.id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{alt.startDate}</td>
            <td className="border px-4 py-2">{alt.endDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AlternativeTable;
