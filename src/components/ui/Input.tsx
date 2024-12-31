import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        {...props}
        className="w-full bg-crimson-darkest border-2 border-crimson-dark p-3 rounded-lg focus:border-crimson outline-none text-crimson-light"
      />
    </div>
  );
};