import React from "react";
import { useTranslation } from "react-i18next";
import { IOrder } from "../../graphql/interfaces";
import { format, parseISO } from "date-fns";
import { Tag, Calendar, User, Package, Clock } from "lucide-react"; // Added icons for better visual

interface OrderDetailsDialogProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  if (!isOpen || !order) return null;

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return <span className="text-gray-400 italic">N/A</span>;
    try {
      return format(parseISO(dateString), "PPp");
    } catch {
      return <span className="text-gray-400 italic">N/A</span>;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal Window (Flex Column for Sticky Header/Footer) */}
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Header (Fixed) */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-indigo-200" />
                {t("home2.orderDetails.title", "Order Details")}
              </h2>
              <p className="text-sm text-indigo-100 mt-1 opacity-90">
                {order.orderNumber
                  ? `${order.orderNumber} / ${order.operationNumber}`
                  : `Order #${order.id}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label={t("common.close", "Close")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 2. Content (Scrollable) */}
          <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
            <div className="space-y-6">
              {/* Section: Basic Info */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                  <Package className="w-4 h-4" />
                  {t("home2.orderDetails.orderInfo", "Order Information")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t("home2.orderDetails.orderNumber", "Order Number")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {order.orderNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t(
                        "home2.orderDetails.operationNumber",
                        "Operation Number"
                      )}
                    </p>
                    <p className="font-medium text-gray-900">
                      {order.operationNumber || "-"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      {t("home2.orderDetails.operationName", "Operation Name")}
                    </p>
                    <p className="font-medium text-gray-900">
                      {order.opName || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section: Resource */}
              {order.resource && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                    <User className="w-4 h-4" />
                    {t("home2.orderDetails.resource", "Resource")}
                  </h3>
                  <div className="flex items-center gap-4">
                    {order.resource.color && (
                      <div
                        className="w-10 h-10 rounded-full shadow-sm border border-gray-200"
                        style={{ backgroundColor: order.resource.color }}
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {order.resource.name}
                      </p>
                      {order.resource.externalCode && (
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded-md inline-block mt-1">
                          {order.resource.externalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section: Timing */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                  <Clock className="w-4 h-4" />
                  {t("home2.orderDetails.timing", "Timing")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs text-green-700 mb-1 font-semibold">
                      {t("home2.orderDetails.startTime", "Start Time")}
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(order.startTime)}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-xs text-red-700 mb-1 font-semibold">
                      {t("home2.orderDetails.endTime", "End Time")}
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(order.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section: Attributes (Dynamic) */}
              {order.attributes && order.attributes.length > 0 && (
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-2">
                    <Tag className="w-4 h-4" />
                    {t("nav.attributes", "Attributes")}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {order.attributes.map((attr) => (
                      <div
                        key={attr.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-500 uppercase">
                            {attr.attribute.name}
                          </span>
                          <span className="text-sm font-medium text-slate-900 mt-0.5">
                            {/* Logic: if isParam use param value, else use text value */}
                            {attr.attribute.isParam
                              ? attr.attributeParam?.attributeValue || "-"
                              : attr.value || "-"}
                          </span>
                        </div>
                        {/* Optional: Add a small icon or indicator based on type */}
                        {attr.attribute.isParam && (
                          <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                            Param
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Footer (Fixed) */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium shadow-sm active:transform active:scale-95"
            >
              {t("common.close", "Close")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsDialog;
