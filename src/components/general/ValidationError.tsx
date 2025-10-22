// src/components/general/ValidationError.tsx

import React from "react";
import { AlertTriangleIcon } from "lucide-react";

interface ValidationErrorProps {
  error: {
    message: string;
    key: number;
  } | null;
}

const ValidationError: React.FC<ValidationErrorProps> = ({ error }) => {
  if (!error) {
    return <div className="h-12 mt-5 mb-5" />;
  }

  return (
    <div className="h-12 flex items-center mt-5 mb-5">
      <div
        key={error.key}
        className="bg-red-50 p-3 rounded-md flex items-center space-x-3 w-full animate-shake"
      >
        <AlertTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-800">{error.message}</p>
      </div>
    </div>
  );
};

export default ValidationError;
