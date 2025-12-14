
import React from 'react';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="w-6 h-6 animate-spin" />
          <span>生成中...</span>
        </>
      ) : (
        <>
          <SparklesIcon className="w-6 h-6" />
          <span>生成草图</span>
        </>
      )}
    </button>
  );
};

export default GenerateButton;