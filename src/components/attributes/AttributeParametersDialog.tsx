import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IAttribute } from "../../graphql/interfaces";
import {
  Layers,
  X,
  Plus,
  Trash2,
  StickyNote,
  LoaderCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useCreateAttrParam,
  useDeleteAttrParam,
} from "../../graphql/hook/attribute";
import { toast } from "react-toastify";

interface Props {
  attribute: IAttribute;
}

const AttributeParametersDialog: React.FC<Props> = ({ attribute }) => {
  // console.log("Attribute in Params Dialog:", attribute);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [newValue, setNewValue] = useState("");
  const [newNote, setNewNote] = useState("");

  // Hooks
  const { createAttrParam, loading: creating } = useCreateAttrParam();
  const { deleteAttrParam, loading: deleting } = useDeleteAttrParam();

  // --- FIX: Use 'attributeParameters' instead of 'parameters' ---
  const parameters = attribute.attributeParameters || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    try {
      await createAttrParam(Number(attribute.id), newValue, newNote);
      setNewValue("");
      setNewNote("");
      toast.success(
        t("attributesPage.paramsDialog.addSuccess", "Parameter added")
      );
    } catch (error) {
      console.error(error);
      toast.error(t("errors.errorGeneral", "An error occurred"));
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteAttrParam(Number(id));
      toast.success(
        t("attributesPage.paramsDialog.deleteSuccess", "Parameter deleted")
      );
    } catch (error) {
      console.error(error);
      toast.error(t("errors.errorGeneral", "An error occurred"));
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center justify-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors text-xs font-medium border border-indigo-200">
          <Layers className="w-3 h-3" />
          <span>
            {/* --- FIX: Updated property name here as well --- */}
            {parameters.length} {t("common.parameters", "Parameters")}
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/30 fixed inset-0 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-0 z-50 animate-in zoom-in-95 flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <Dialog.Title className="text-lg font-bold text-gray-800">
                {t("attributesPage.paramsDialog.title", "Manage Parameters")}
              </Dialog.Title>
              {/* --- FIX: Used Dialog.Description for the subtitle --- */}
              <Dialog.Description className="text-sm text-gray-500">
                {attribute.name}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Add New Parameter Form - Fixed at top of body */}
            <div className="p-4 bg-gray-50 border-b">
              <form onSubmit={handleAdd} className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    {t("attributesPage.paramsDialog.valueLabel", "Value")}
                  </label>
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder={t(
                      "attributesPage.paramsDialog.valuePlaceholder",
                      "e.g. Red, 10mm, S235"
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
                    {t(
                      "attributesPage.paramsDialog.noteLabel",
                      "Note (Optional)"
                    )}
                  </label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={t(
                      "attributesPage.paramsDialog.notePlaceholder",
                      "e.g. Color Code, Description"
                    )}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newValue.trim() || creating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
                >
                  {creating ? (
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      {t("common.add", "Add")}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* List of Parameters - Scrollable area */}
            <div className="overflow-y-auto p-4 flex-1">
              {parameters.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Layers className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>
                    {t(
                      "attributesPage.paramsDialog.noParams",
                      "No parameters defined yet."
                    )}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("attributesPage.paramsDialog.valueLabel", "Value")}
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("attributesPage.paramsDialog.noteLabel", "Note")}
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("common.actions", "Actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parameters.map((param) => (
                      <tr key={param.id} className="hover:bg-gray-50 group">
                        <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {param.attributeValue}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                          {param.attributeNote ? (
                            <span className="flex items-center gap-2">
                              <StickyNote className="w-3 h-3 text-gray-400" />
                              {param.attributeNote}
                            </span>
                          ) : (
                            <span className="text-gray-300 italic">-</span>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(param.id)}
                            disabled={deleting}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                            title={t("common.delete", "Delete")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {t("common.close", "Close")}
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AttributeParametersDialog;
