
import React from 'react';
import { StyleParams } from './StyleSelector';

interface StyleCustomizerProps {
  customizations: (keyof StyleParams)[];
  params: StyleParams;
  onParamsChange: (params: StyleParams) => void;
}

const paramOptions = {
  lineWeight: {
    label: '线条粗细',
    options: ['纤细', '常规', '粗重'] as const,
  },
  saturation: {
    label: '颜色饱和度',
    options: ['低', '中等', '高'] as const,
  },
};

const StyleCustomizer: React.FC<StyleCustomizerProps> = ({ customizations, params, onParamsChange }) => {
  const handleParamChange = (paramKey: keyof StyleParams, value: string) => {
    onParamsChange({
      ...params,
      [paramKey]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-sm font-semibold text-slate-500">参数调整</h4>
      {customizations.map((paramKey) => {
        const config = paramOptions[paramKey];
        if (!config) return null;

        const currentValue = params[paramKey];

        return (
          <div key={paramKey}>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              {config.label}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {config.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleParamChange(paramKey, option)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 ${
                    currentValue === option
                      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StyleCustomizer;
