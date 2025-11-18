'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { forwardRef } from 'react';

type Props = {
  label: string;
  //value: string;
  //onChange: (value: string) => void;
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...rest }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="space-y-2">
        <label className="text-gray-700 block mb-1">{label}</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            ref={ref}
            type={show ? 'text' : 'password'}
            placeholder="**********"
            className="pl-10 pr-10 bg-gray-50 border border-gray-200 h-9 w-full rounded-md"
            {...rest}
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
