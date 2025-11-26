import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { IAttribute } from "../../graphql/interfaces";
import { Layers, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  attribute: IAttribute;
}

const AttributeParametersDialog: React.FC<Props> = ({ attribute }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center justify-center space-x-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors text-xs font-medium border border-indigo-200">
          <Layers className="w-3 h-3" />
          <span>
            {/* Assuming params exist in interface, otherwise 0 */}
            {attribute.parameters?.length || 0}{" "}
            {t("common.parameters", "Parameters")}
          </span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/30 fixed inset-0 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-6 z-50 animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h3 className="text-lg font-bold text-gray-800">
              {t("attributesPage.paramsDialog.title", "Manage Parameters")} -{" "}
              {attribute.name}
            </h3>
            <Dialog.Close asChild>
              <button className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <div className="py-8 text-center text-gray-500">
            {/* This is where the nested UI for adding Red, Green, etc. will go later */}
            <p>Parameter management UI will be implemented here.</p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AttributeParametersDialog;
