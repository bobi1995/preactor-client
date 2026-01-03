import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import {
  X,
  Plus,
  Trash2,
  Tag,
  Tags,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { IOrder } from "../../graphql/interfaces";
import { useAttributes } from "../../graphql/hook/attribute";
import {
  useAddOrderAttribute,
  useDeleteOrderAttribute,
} from "../../graphql/hook/orderAttribute";
import { toast } from "react-toastify";

interface Props {
  order: IOrder;
}

const OrderAttributesDialog: React.FC<Props> = ({ order }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [selectedAttrId, setSelectedAttrId] = useState<string>("");
  const [textValue, setTextValue] = useState<string>("");
  const [selectedParamId, setSelectedParamId] = useState<string>("");

  // Data Hooks
  const { attributes, loading: loadingAttrs } = useAttributes();
  const { addOrderAttribute, loading: adding } = useAddOrderAttribute();
  const { deleteOrderAttribute, loading: deleting } = useDeleteOrderAttribute();

  const assignedAttributeIds = new Set(
    order.attributes?.map((a) => String(a.attribute.id)) || []
  );

  const availableAttributes = attributes.filter(
    (attr) => !assignedAttributeIds.has(String(attr.id))
  );

  const selectedAttributeDef = attributes.find(
    (a) => String(a.id) === selectedAttrId
  );
  const isParamBased = selectedAttributeDef?.isParam === true;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttrId) return;
    if (assignedAttributeIds.has(selectedAttrId)) {
      toast.error(
        t("errors.attributeAlreadyAssigned", "Attribute already assigned")
      );
      return;
    }
    if (isParamBased && !selectedParamId) {
      toast.error(t("errors.required", "Parameter selection is required"));
      return;
    }
    try {
      await addOrderAttribute(
        order.id,
        Number(selectedAttrId),
        isParamBased ? undefined : textValue,
        isParamBased ? Number(selectedParamId) : undefined
      );
      toast.success(
        t(
          "rawOrdersPage.attributes.successAssign",
          "Attribute added successfully"
        )
      );

      // Reset Form
      setSelectedAttrId("");
      setTextValue("");
      setSelectedParamId("");
    } catch (error) {
      toast.error(t("errors.errorGeneral", "An error occurred"));
    }
  };

  const handleDelete = async (attrId: number) => {
    try {
      await deleteOrderAttribute(attrId);
      toast.success(
        t(
          "rawOrdersPage.attributes.successUnassign",
          "Attribute unassigned successfully"
        )
      );
    } catch (error) {
      toast.error(t("errors.errorGeneral"));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="text-gray-400 hover:text-indigo-600 transition-colors p-1.5 rounded hover:bg-gray-100 flex items-center gap-1"
          title={t("rawOrdersPage.attributes.manage", "Manage Attributes")}
        >
          <Tags className="w-4 h-4" />
          {order.attributes && order.attributes.length > 0 && (
            <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 rounded-full font-bold">
              {order.attributes.length}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/30 fixed inset-0 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-0 z-50 animate-in zoom-in-95 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl">
            <div>
              <Dialog.Title className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                {t("rawOrdersPage.attributes.title", "Order Attributes")}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                {order.orderNumber} / {order.operationNumber}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Add New Section */}
            <form
              onSubmit={handleAdd}
              className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 mb-6"
            >
              <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">
                {t("common.add", "Add New Attribute")}
              </h4>
              <div className="space-y-3">
                {/* 1. Select Attribute Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t(
                      "changeoverGroupsPage.timesDialog.attributeLabel",
                      "Attribute"
                    )}
                  </label>
                  <select
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    value={selectedAttrId}
                    onChange={(e) => {
                      setSelectedAttrId(e.target.value);
                      setSelectedParamId("");
                      setTextValue("");
                    }}
                    disabled={loadingAttrs || availableAttributes.length === 0}
                  >
                    <option value="" disabled>
                      {availableAttributes.length === 0
                        ? t(
                            "rawOrdersPage.attributes.allAssigned",
                            "All attributes assigned"
                          )
                        : t("common.select", "Select...")}
                    </option>
                    {availableAttributes.map((attr) => (
                      <option key={attr.id} value={attr.id}>
                        {attr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Conditional Input */}
                {selectedAttrId && (
                  <div className="animate-in fade-in slide-in-from-top-1">
                    {isParamBased ? (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("common.parameter", "Parameter Value")}
                        </label>
                        <select
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                          value={selectedParamId}
                          onChange={(e) => setSelectedParamId(e.target.value)}
                        >
                          <option value="" disabled>
                            {t("common.select", "Select...")}
                          </option>
                          {selectedAttributeDef?.attributeParameters?.map(
                            (param) => (
                              <option key={param.id} value={param.id}>
                                {param.attributeValue}
                              </option>
                            )
                          )}
                        </select>
                        {(!selectedAttributeDef?.attributeParameters ||
                          selectedAttributeDef.attributeParameters.length ===
                            0) && (
                          <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t(
                              "errors.noParams",
                              "No parameters defined for this attribute."
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("common.value", "Value")}
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="e.g. 120mm"
                          value={textValue}
                          onChange={(e) => setTextValue(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    !selectedAttrId ||
                    (isParamBased && !selectedParamId) ||
                    (!isParamBased && !textValue.trim()) ||
                    adding
                  }
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {adding ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      {t("common.add", "Add Attribute")}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* List Existing */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                {t(
                  "rawOrdersPage.attributes.assigned_attributes",
                  "Assigned Attributes"
                )}
              </h4>

              {!order.attributes || order.attributes.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  {t(
                    "rawOrdersPage.attributes.none",
                    "No attributes assigned yet."
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {order.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Tag className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {attr.attribute.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attr.attribute.isParam
                              ? attr.attributeParam?.attributeValue
                              : attr.value}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(attr.id)}
                        disabled={deleting}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title={t("common.delete")}
                      >
                        {deleting ? (
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default OrderAttributesDialog;
