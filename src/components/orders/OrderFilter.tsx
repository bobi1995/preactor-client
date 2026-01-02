import React from "react";
import { useTranslation } from "react-i18next";
import { Search, Calendar, X } from "lucide-react";

export type PeriodFilter = "all" | "today" | "next7" | "next14";

interface OrderFilterProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  period: PeriodFilter;
  onPeriodChange: (val: PeriodFilter) => void;
  // Optional: If you want to control sort from here as well,
  // but usually table headers are better for sorting.
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  searchTerm,
  onSearchChange,
  period,
  onPeriodChange,
}) => {
  const { t } = useTranslation();

  const periods: { value: PeriodFilter; label: string }[] = [
    { value: "all", label: t("ordersPage.filter.all", "All Time") },
    { value: "today", label: t("ordersPage.filter.today", "Today") },
    { value: "next7", label: t("ordersPage.filter.next7", "Next 7 Days") },
    { value: "next14", label: t("ordersPage.filter.next14", "Next 14 Days") },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t(
            "ordersPage.filter.placeholder",
            "Search order, product, resource..."
          )}
          className="pl-10 pr-10 block w-full sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 border p-2"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Period Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        <div className="flex items-center text-sm text-gray-500 mr-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span className="hidden lg:inline">
            {t("ordersPage.filter.period", "Period")}:
          </span>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`
                px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap
                ${
                  period === p.value
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }
              `}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderFilter;
