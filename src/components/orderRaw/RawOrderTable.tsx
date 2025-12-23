import React from "react";
import { useTranslation } from "react-i18next";
import { IOrderRaw } from "../../graphql/interfaces";
import { PackageOpen, MoreHorizontal } from "lucide-react";
import moment from "moment";
import OrderAttributesDialog from "./OrderAttributesDialog";

interface Props {
  orders: IOrderRaw[];
}

const RawOrderTable: React.FC<Props> = ({ orders }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Combined Order/Op Column */}
              <th className="w-2/12 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("rawOrdersPage.table.orderOp", "Order / Op")}
              </th>
              {/* Added Operation Name */}
              <th className="w-2/12 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("rawOrdersPage.table.opName", "Operation")}
              </th>
              <th className="w-2/12 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("rawOrdersPage.table.partNo", "Part No")}
              </th>
              <th className="w-3/12 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("rawOrdersPage.table.product", "Product")}
              </th>
              <th className="w-1/12 px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("rawOrdersPage.table.quantity", "Qty")}
              </th>
              <th className="w-1/12 px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("rawOrdersPage.table.dueDate", "Due")}
              </th>
              <th className="w-1/12 px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t("common.actions", "Actions")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <PackageOpen className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm">
                      {t("rawOrdersPage.table.noData", "No orders found.")}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-indigo-50/30 transition-colors"
                >
                  {/* Combined Order / Op */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center text-xs">
                      <span className="font-bold text-gray-800">
                        {order.orderNo}
                      </span>
                      <span className="mx-1 text-gray-400">/</span>
                      <span className="font-medium text-indigo-600">
                        {order.opNo}
                      </span>
                    </div>
                  </td>
                  {/* Operation Name */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-xs text-gray-700 font-medium truncate block max-w-[150px]">
                      {order.operationName}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-xs text-gray-600">
                      {order.partNo}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className="text-xs text-gray-600 font-medium truncate block max-w-[200px]"
                      title={order.product}
                    >
                      {order.product}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      {moment(order.dueDate).format("DD-MMM-YYYY HH:mm")}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center text-xs font-medium">
                    <OrderAttributesDialog order={order} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawOrderTable;
