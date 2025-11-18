import { Label } from '@/src/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';
import React from 'react';

type Option = {
  value: string;
  label: string;
  desc?: string;
  icon?: React.ReactNode;
};

type Props = {
  options: Option[];
  value?: string;
  onValueChange?: (value: string) => void;
};

export default function RadioCardGroup({
  options,
  value,
  onValueChange,
}: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3"
    >
      {options.map((opt) => {
        return (
          <div key={opt.value}>
            <RadioGroupItem
              value={opt.value}
              id={opt.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={opt.value}
              className="flex h-[120px] cursor-pointer flex-col justify-between rounded-xl border border-gray-300 p-4 transition hover:border-black/70 peer-data-[state=checked]:border-black peer-data-[state=checked]:shadow-[0_0_0_1px_black]"
            >
              {opt.icon && <div className="mb-3 size-7">{opt.icon}</div>}
              <div className="text-sm font-semibold">{opt.label}</div>
              {opt.desc && (
                <div className="text-xs text-neutral-500">{opt.desc}</div>
              )}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
