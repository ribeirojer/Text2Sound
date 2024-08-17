import React from "react";

type LoadingProps = {
  message?: string; // Mensagem opcional para exibir abaixo do spinner
};

const Loading = ({ message }: LoadingProps) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
      <svg
        className="animate-spin h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="text-[--zomp] opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.291z"
        />
      </svg>
      {message && (
        <p className="mt-4 text-lg text-white">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loading;
