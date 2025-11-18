'use client';

import { LucideIcon } from 'lucide-react';
import { forwardRef } from 'react';

type Props = {
  label: string;
  placeholder?: string;
  icon: LucideIcon;
  type?: string;
};

const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, placeholder, icon: Icon, type, ...rest }, ref) => {
    return (
      <div className="space-y-2">
        <label className="text-gray-700 block mb-1">{label}</label>
        <div className="relative">
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={ref}
            type={type || 'text'}
            placeholder={placeholder}
            className="pl-10 bg-gray-50 border border-gray-200 h-9 w-full rounded-md"
            {...rest}
          />
        </div>
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
export default TextInput;
