import React from "react";
import AssignAlternativeBtn from "./AssignAlternativeBtn";
import { IResource } from "../../../graphql/interfaces";

interface AlternativeComponentProps {
  t: (key: string, options?: any) => string;
  resource: IResource;
}
const parseUnixToDay = (unix: string) => {
  const date = new Date(parseInt(unix) * 1000);
  return date.toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const AlternativeComponent: React.FC<AlternativeComponentProps> = ({
  resource,
  t,
}) => {
  return (
    <div className="p-4 border rounded-md shadow-md">
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold">{t("alternative_shift")}</h2>
        <AssignAlternativeBtn resourceId={resource.id} t={t} />
      </div>
      {resource.alternateShifts.length > 0 ? (
        <table className="min-w-full border-collapse border border-gray-200 mt-5">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">{t("name")}</th>
              <th className="border px-4 py-2">{t("start")}</th>
              <th className="border px-4 py-2">{t("end")}</th>
            </tr>
          </thead>
          <tbody>
            {resource.alternateShifts.map((shift) => (
              <tr key={shift.id}>
                <td className="border px-4 py-2">{shift.shift.name}</td>
                <td className="border px-4 py-2">
                  {parseUnixToDay(shift.startDate)}
                </td>
                <td className="border px-4 py-2">
                  {parseUnixToDay(shift.endDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">{t("no_alternative_shifts")}</p>
      )}
    </div>
  );
};

export default AlternativeComponent;
