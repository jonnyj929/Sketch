
import React from 'react';
import { HistoryEntry } from '../App';
import { ClockIcon } from './icons/ClockIcon';
import { TrashIcon } from './icons/TrashIcon';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
          <ClockIcon className="w-6 h-6" />
          生成历史
        </h2>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
            aria-label="清除所有历史记录"
          >
            <TrashIcon className="w-4 h-4" />
            清除历史
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p>您生成的草图将显示在这里。</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelect(entry)}
              className="group relative aspect-[9/16] bg-slate-100 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`选择草图，提示： ${entry.sketchTitle || entry.inputText.substring(0, 50)}...`}
            >
              <img
                src={entry.imageUrl}
                alt={`草图: ${entry.sketchTitle || entry.inputText.substring(0, 30)}...`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-colors duration-300 flex flex-col justify-end p-2 text-left">
                  <p className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-3">
                    {entry.sketchTitle || entry.inputText}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-wrap">
                    <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-full">
                      {entry.aspectRatio}
                    </span>
                    <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-full">
                      {entry.style}
                    </span>
                    {entry.styleParams?.lineWeight && entry.styleParams.lineWeight !== '常规' && (
                        <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-full">
                            {entry.styleParams.lineWeight}
                        </span>
                    )}
                    {entry.styleParams?.saturation && entry.styleParams.saturation !== '中等' && (
                        <span className="text-white text-xs bg-black/50 px-1.5 py-0.5 rounded-full">
                            {entry.styleParams.saturation}
                        </span>
                    )}
                  </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
