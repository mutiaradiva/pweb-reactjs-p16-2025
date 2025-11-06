import React from 'react';

type ErrorBoxProps = {
  message: string;
};

const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
  return (
    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center mt-0.5">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <div className="flex-1">
          <p className="text-red-400 text-sm font-medium">Error</p>
          <p className="text-gray-300 text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBox;