import React from "react";
import { useTranslation } from "react-i18next";
import { IOrder } from "../../graphql/interfaces";
import { format, parseISO } from "date-fns";

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
    if (!dateString) return t("home2.orderDetails.notAvailable", "N/A");
    try {
      return format(parseISO(dateString), "PPp");
    } catch {
      return t("home2.orderDetails.notAvailable", "N/A");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {t("home2.orderDetails.title", "Order Details")}
              </h2>
              <p className="text-sm text-indigo-100 mt-1">
                {order.orderNumber || `Order #${order.id}`}
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Order Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t("home2.orderDetails.orderInfo", "Order Information")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {t("home2.orderDetails.orderNumber", "Order Number")}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {order.orderNumber ||
                        t("home2.orderDetails.notAvailable", "N/A")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {t(
                        "home2.orderDetails.operationNumber",
                        "Operation Number"
                      )}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {order.operationNumber ||
                        t("home2.orderDetails.notAvailable", "N/A")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">
                      {t("home2.orderDetails.operationName", "Operation Name")}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {order.opName ||
                        t("home2.orderDetails.notAvailable", "N/A")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resource Information */}
              {order.resource && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    {t("home2.orderDetails.resource", "Resource")}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                    {order.resource.color && (
                      <div
                        className="w-12 h-12 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: order.resource.color }}
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-base font-medium text-gray-900">
                        {order.resource.name}
                      </p>
                      {order.resource.externalCode && (
                        <p className="text-sm text-gray-600 font-mono mt-1">
                          {order.resource.externalCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timing Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("home2.orderDetails.timing", "Timing")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {t("home2.orderDetails.startTime", "Start Time")}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDateTime(order.startTime)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      {t("home2.orderDetails.endTime", "End Time")}
                    </p>
                    <p className="text-base font-medium text-gray-900">
                      {formatDateTime(order.endTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
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
