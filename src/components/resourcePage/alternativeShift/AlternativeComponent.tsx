import React from "react";
import AssignAlternativeBtn from "./AssignAlternativeBtn";
import { IResource } from "../../../graphql/interfaces";
import { convertUnixToDate } from "../../../utils/time-converters";
import { useDeleteAlternativeShift } from "../../../graphql/hook/resource";
import { Trash2 } from "lucide-react";
interface AlternativeComponentProps {
  t: (key: string, options?: any) => string;
  resource: IResource;
}

const AlternativeComponent: React.FC<AlternativeComponentProps> = ({
  resource,
  t,
}) => {
  const { deleteAlternativeShift, loading } = useDeleteAlternativeShift();

  const handleDelete = async (id: string) => {
    await deleteAlternativeShift(id);
    window.location.reload();
  };

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
              <th>{t("delete")}</th>
            </tr>
          </thead>
          <tbody>
            {resource.alternateShifts.map((shift) => (
              <tr key={shift.id}>
                <td className="border px-4 py-2">{shift.shift.name}</td>
                <td className="border px-4 py-2">
                  {convertUnixToDate(parseInt(shift.startDate))}
                </td>
                <td className="border px-4 py-2">
                  {convertUnixToDate(parseInt(shift.endDate))}
                </td>
                <td className="border px-4 py-2">
                  <Trash2
                    className="text-red-500 cursor-pointer h-8 w-8 m-auto"
                    onClick={() => handleDelete(shift.id)}
                  />
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
