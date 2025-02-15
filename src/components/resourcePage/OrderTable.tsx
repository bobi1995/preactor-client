import React from "react";
import { IOrder } from "../../graphql/interfaces";
import {
  table,
  thead,
  classRowHeader,
  classRowTable,
} from "../../ui/table-styles";
import { useLocation } from "react-router";
import Pagination, { itemsPerPage } from "../general/Pagination";
import SearchBar from "../general/SearchBar";
import {
  convertDateToUnix,
  convertUnixToDateWithHours,
} from "../../utils/time-converters";

interface IOrderTableProps {
  orders: IOrder[];
  t: (key: string) => string;
}

const OrderTable: React.FC<IOrderTableProps> = ({ orders, t }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query")?.toLowerCase() || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const filteredOrders = orders.filter((order: IOrder) =>
    order.OrderNo?.toLowerCase().includes(query)
  );

  const { totalPages, data } = itemsPerPage(currentPage, filteredOrders);
  return (
    <div className="m-auto w-full bg-white shadow-md rounded-lg p-2">
      <div className="flex gap-2">
        <SearchBar placeholder={t("search")} />
      </div>
      <table
        className={`${table} border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2`}
      >
        <thead className={`${thead} bg-gray-100`}>
          <tr className={classRowHeader}>
            <th className="px-6 py-4 text-left">{t("orno")}</th>
            <th className="px-6 py-4 text-left">{t("opno")}</th>
            <th className="px-6 py-4 text-left">{t("start")}</th>
            <th className="px-6 py-4 text-left">{t("end")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order: IOrder) => (
            <tr
              key={order.id}
              className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
            >
              <td className="px-6 py-5 text-left">{order.OrderNo}</td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                {order.OpNo} - {order.OperationName}
              </td>
              <td className="px-6 py-5 text-gray-700 text-sm">
                {convertUnixToDateWithHours(parseInt(order.StartTime) / 1000)}
              </td>
              <td className="px-6 py-5 text-gray-700 text-sm">
                {convertUnixToDateWithHours(parseInt(order.EndTime) / 1000)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default OrderTable;
