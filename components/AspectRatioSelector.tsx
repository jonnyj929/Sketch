
import React from 'react';
import { AspectRatioIcon } from './icons/AspectRatioIcon';

interface AspectRatioSelectorProps {
  ratios: string[];
  selectedRatio: string;
  onRatioChange: (ratio: string) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ ratios, selectedRatio, onRatioChange }) => {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-slate-600 flex items-center gap-2 mb-3">
        <AspectRatioIcon className="w-5 h-5" />
        选择尺寸
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        {ratios.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onRatioChange(ratio)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
              selectedRatio === ratio
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;
