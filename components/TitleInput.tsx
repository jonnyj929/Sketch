
import React from 'react';

interface TitleInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const TitleInput: React.FC<TitleInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="mt-4">
      <label htmlFor="sketch-title" className="block text-sm font-medium text-slate-600 mb-2">
        草图标题 (可选)
      </label>
      <input
        type="text"
        id="sketch-title"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 text-base bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
      />
    </div>
  );
};

export default TitleInput;
