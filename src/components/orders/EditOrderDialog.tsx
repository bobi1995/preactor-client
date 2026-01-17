import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import { X, Edit, Save, Loader2, Calendar as CalIcon } from "lucide-react";
import { IOrder } from "../../graphql/interfaces";
import { useUpdateOrder } from "../../graphql/hook/order";
import { toast } from "react-toastify";
import ConfirmationDialog from "../general/ConfirmDialog"; // Import the universal dialog

interface Props {
  order: IOrder;
}

const EditOrderDialog: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { updateOrder, loading } = useUpdateOrder();

  // Form State
  const [priority, setPriority] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setPriority(order.priority || 10);
      setQuantity(order.remainingQuan || order.quantity || 0);

      if (order.dueDate) {
        const date = new Date(order.dueDate);
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = new Date(date.getTime() - offset)
          .toISOString()
          .slice(0, 16);
        setDueDate(localISOTime);
      } else {
        setDueDate("");
      }
    }
  }, [isOpen, order]);

  // Check if priority actually changed
  const hasPriorityChanged = Number(priority) !== (order.priority || 10);

  // Core update logic (used by both direct save and confirmation dialog)
  const executeUpdate = async () => {
    try {
      const finalDate = dueDate ? new Date(dueDate).toISOString() : null;

      await updateOrder({
        id: order.id,
        priority: Number(priority),
        remainingQuan: Number(quantity),
        dueDate: finalDate,
      });
      toast.success(t("common.saved", "Order updated successfully"));
      setIsOpen(false);
    } catch (error) {
      toast.error(t("errors.saveFailed", "Failed to save changes"));
      // Re-throw to ensure ConfirmationDialog knows it failed (stops loading spinner)
      throw error;
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If priority hasn't changed, save immediately.
    // If it HAS changed, we rely on the ConfirmationDialog button click instead.
    if (!hasPriorityChanged) {
      executeUpdate();
    }
  };

  // Reusable button styling to ensure it looks the same in both states
  const SaveButtonContent = (
    <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 cursor-pointer">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {t("common.save", "Save Changes")}
    </div>
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="text-gray-400 hover:text-indigo-600 p-1.5 rounded hover:bg-gray-100 transition-colors"
          title={t("common.edit", "Edit Order")}
        >
          <Edit className="w-4 h-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/30 fixed inset-0 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-bold text-gray-800">
              {t("ordersPage.editTitle", "Edit Order")}: {order.orderNumber}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Priority */}
            <div
              className={`transition-colors p-2 rounded-lg -mx-2 ${
                hasPriorityChanged ? "bg-amber-50 border border-amber-100" : ""
              }`}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("ordersPage.priority", "Priority (1-100)")}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t(
                  "ordersPage.priorityDesc",
                  "Higher number = lower priority (typically)"
                )}
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("ordersPage.quantity", "Remaining Quantity")}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
              />
            </div>

            {/* Due Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("ordersPage.dueDate", "Due Date")}
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border pr-10 text-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CalIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              {/* CONDITIONAL RENDERING: 
                  If priority changed, button opens Confirmation Dialog.
                  If not, button submits form directly.
              */}
              {hasPriorityChanged ? (
                <ConfirmationDialog
                  triggerButton={
                    <button type="button">{SaveButtonContent}</button>
                  }
                  title={t(
                    "ordersPage.priorityWarningTitle",
                    "Update Priority?"
                  )}
                  description={
                    <div className="space-y-2">
                      <p>
                        {t(
                          "ordersPage.priorityWarningDesc",
                          "You are changing the priority for this operation."
                        )}
                      </p>
                      <p className="font-semibold text-amber-700">
                        {t(
                          "ordersPage.priorityWarningCascade",
                          "This will automatically update ALL other operations for Order {{orderNum}} to Priority {{newPriority}}.",
                          { orderNum: order.orderNumber, newPriority: priority }
                        )}
                      </p>
                    </div>
                  }
                  confirmAction={executeUpdate}
                  confirmText={t("common.confirmUpdate", "Confirm Update")}
                />
              ) : (
                <button type="submit" disabled={loading}>
                  {SaveButtonContent}
                </button>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditOrderDialog;
