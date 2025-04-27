import { useLnOrders } from "../graphql/hook/ln_orders";
import {
  classRowHeader,
  classRowTable,
  table,
  thead,
} from "../ui/table-styles";
import { convertUnixToDateWithHours } from "../utils/time-converters";
import { useTranslation } from "react-i18next";
import InfinityLoader from "../components/general/Loader";
import ErrorComponent from "../components/general/Error";

const LNOrders = () => {
  const { t } = useTranslation("resource");
  const { orders, loading, error, reload } = useLnOrders();
  if (loading) {
    return <InfinityLoader />;
  }
  if (error) {
    return (
      <ErrorComponent
        message="Unable to fetch resources. Please check your connection."
        onRetry={() => reload()}
      />
    );
  }
  return (
    <div>
      <table
        className={`${table} border-collapse border border-gray-200 rounded-lg overflow-hidden mt-2`}
      >
        <thead className={`${thead} bg-gray-100`}>
          <tr className={classRowHeader}>
            <th className="px-6 py-4 text-left">{t("orno")}</th>
            <th className="px-6 py-4 text-left">{t("project")}</th>
            <th className="px-6 py-4 text-left">{t("opno")}</th>
            <th className="px-6 py-4 text-left">{t("resource")}</th>
            <th className="px-6 py-4 text-left">{t("start")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr
              key={order.id}
              className={`hover:bg-gray-50 ${classRowTable} transition-all duration-150`}
            >
              <td className="px-6 py-5 text-left">{order.OrderNo}</td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                {order.Project}
              </td>
              <td className="px-6 py-5 text-gray-700 font-medium text-sm">
                {order.OpNo.slice(0, 2)} - {order.Operation}
              </td>
              <td>{order.ResourceGroupName}</td>
              <td className="px-6 py-5 text-gray-700 text-sm">
                {convertUnixToDateWithHours(parseInt(order.DueDate) / 1000)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LNOrders;
