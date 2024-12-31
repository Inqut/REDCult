import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  icon?: React.ReactNode;
}

export const TextArea = ({ label, icon, ...props }: TextAreaProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <textarea
        {...props}
        className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none text-crimson-light h-32 resize-none"
      />
    </div>
  );
};