
import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full flex-grow p-4 text-base bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none"
      rows={10}
    />
  );
};

export default TextInput;
