'use client';

import { LucideIcon } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon: LucideIcon;
  type?: string;
};

export default function TextInput({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 block mb-1">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type={type || 'text'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 bg-gray-50 border border-gray-200 h-9 w-full rounded-md"
          required
        />
      </div>
    </div>
  );
}
