
import React from 'react';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import StyleCustomizer from './StyleCustomizer';

// Define the type for style parameters, exported for use in App.tsx
export interface StyleParams {
  lineWeight?: '纤细' | '常规' | '粗重';
  saturation?: '低' | '中等' | '高';
}

interface StyleSelectorProps {
  styles: string[];
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  styleParams: StyleParams;
  onParamsChange: (params: StyleParams) => void;
}

// Map styles to their available customization options
const styleCustomizations: { [key: string]: (keyof StyleParams)[] } = {
  '彩色铅笔': ['saturation'],
  '铅笔': ['lineWeight'],
  '木炭': ['lineWeight'],
};

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onStyleChange, styleParams, onParamsChange }) => {
  const availableCustomizations = styleCustomizations[selectedStyle] || [];

  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-slate-600 flex items-center gap-2 mb-3">
        <PaintBrushIcon className="w-5 h-5" />
        选择风格
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
              selectedStyle === style
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {availableCustomizations.length > 0 && (
         <div className="mt-4 pt-4 border-t border-slate-200">
             <StyleCustomizer
                key={selectedStyle}
                customizations={availableCustomizations}
                params={styleParams}
                onParamsChange={onParamsChange}
             />
         </div>
      )}
    </div>
  );
};

export default StyleSelector;
