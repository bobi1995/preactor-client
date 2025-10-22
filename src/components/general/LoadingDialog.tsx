// src/components/general/LoadingDialog.tsx

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { InfinitySpin } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LoadingDialogProps {
  isLoading: boolean;
}

const LoadingDialog: React.FC<LoadingDialogProps> = ({ isLoading }) => {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={isLoading}>
      <Dialog.Portal>
        {/* The overlay remains full-screen and semi-transparent */}
        <Dialog.Overlay className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[90] data-[state=open]:animate-overlayShow" />

        {/* The Dialog.Content is now a styled, fixed-size box */}
        <Dialog.Content
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] focus:outline-none bg-white rounded-xl shadow-2xl p-8 w-auto h-auto flex flex-col items-center justify-center data-[state=open]:animate-contentShow"
        >
          <Dialog.Title asChild>
            <VisuallyHidden>{t("common.loading", "Loading...")}</VisuallyHidden>
          </Dialog.Title>
          <div className="flex flex-col items-center">
            <InfinitySpin width="150" color="#4f46e5" />
            <p className="text-center text-indigo-600 font-semibold mt-2 animate-pulse">
              {t("common.loading", "Loading...")}
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LoadingDialog;
