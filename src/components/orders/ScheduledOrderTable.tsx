import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IOrder } from "../../graphql/interfaces";
import { format } from "date-fns";
import { parseAsLocal } from "../../utils/gantt-utils";
import OrderAttributesDialog from "./OrderAttributesDialog"; // Import the Dialog
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";
import EditOrderDialog from "./EditOrderDialog";

interface Props {
  orders: IOrder[];
}

type SortKey = "orderNumber" | "startTime" | "product";
type SortDirection = "asc" | "desc";

const ScheduledOrderTable: React.FC<Props> = ({ orders }) => {
  const { t } = useTranslation();

  // --- State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  }>({
    key: "startTime",
    direction: "asc",
  });

  const itemsPerPage = 15;

  // --- Helpers ---
  const handleSort = (key: SortKey) => {
    let direction: SortDirection = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString)
      return <span className="text-gray-400 italic">Pending</span>;
    const date = parseAsLocal(dateString);
    return date ? format(date, "dd/MM/yyyy HH:mm") : "-";
  };

  // --- Process Data ---
  const sortedOrders = useMemo(() => {
    const sorted = [...orders];
    sorted.sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];

      if (!aValue) return 1;
      if (!bValue) return -1;

      // Numeric check for Order Numbers
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);

      if (!isNaN(aNum) && !isNaN(bNum) && sortConfig.key === "orderNumber") {
        if (aNum < bNum) return sortConfig.direction === "asc" ? -1 : 1;
        if (aNum > bNum) return sortConfig.direction === "asc" ? 1 : -1;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [orders, sortConfig]);

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderSortIcon = (key: SortKey) => {
    if (sortConfig.key !== key) return <div className="w-4 h-4" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="w-1/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("ordersPage.table.orderOp", "Op No")}
              </th>
              <th
                onClick={() => handleSort("product")}
                className="w-2/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("ordersPage.table.product", "Product")}
                  {renderSortIcon("product")}
                </div>
              </th>
              <th className="w-2/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("ordersPage.table.resource", "Resource")}
              </th>

              <th
                onClick={() => handleSort("startTime")}
                className="w-2/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  {t("ordersPage.table.startDate", "Start Time")}
                  {renderSortIcon("startTime")}
                </div>
              </th>
              <th className="w-2/12 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("ordersPage.table.endDate", "End Time")}
              </th>
              <th className="w-1/12 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("ordersPage.table.quantity", "Qty")}
              </th>
              {/* Added Attributes Action Column */}
              <th className="w-1/12 px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("nav.attributes", "Attributes")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Package className="w-10 h-10 text-gray-300 mb-2" />
                    <p>
                      {t(
                        "ordersPage.table.noData",
                        "No scheduled orders found."
                      )}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center text-xs">
                      <span className="font-bold text-gray-800">
                        {order.orderNumber}
                      </span>
                      <span className="mx-1 text-gray-400">/</span>
                      <span className="font-medium text-indigo-600">
                        {order.operationNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {order.product || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-indigo-600 font-medium">
                    {order.resource?.name || (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(order.startTime)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(order.endTime)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 text-center font-semibold bg-gray-50">
                    {order.remainingQuan ?? order.quantity ?? 0}
                  </td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <EditOrderDialog order={order} />
                    <OrderAttributesDialog order={order} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer (Unchanged logic) */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          {/* ... (Keep existing pagination UI) ... */}
          <div className="text-sm text-gray-500">
            {t("common.showing", "Showing")}{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            {t("common.to2", "to")}{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, orders.length)}
            </span>{" "}
            {t("common.of", "of")}{" "}
            <span className="font-medium">{orders.length}</span>{" "}
            {t("common.results", "results")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledOrderTable;
