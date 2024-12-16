import React from "react";
interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h1 className="text-lg font-bold text-gray-800 mb-2">{message}</h1>
      <p className="text-gray-600 mb-4">Please try again later.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorComponent;
