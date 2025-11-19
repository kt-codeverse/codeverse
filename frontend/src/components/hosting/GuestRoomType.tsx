'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

export default function GuestRoomType({
  options,
  value,
  onValueChange,
}: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="space-y-4"
    >
      {options.map((opt) => (
        <div key={opt.value}>
          <RadioGroupItem
            value={opt.value}
            id={opt.value}
            className="peer sr-only"
          />
          <Label
            htmlFor={opt.value}
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-300
            p-4 transition hover:border-black/70 peer-data-[state=checked]:border-black 
            peer-data-[state=checked]:shadow-[0_0_0_1px_black]"
          >
            {opt.icon && <div className="size-8 shrink-0">{opt.icon}</div>}
            <div className="flex flex-col">
              <span className="font-semibold">{opt.label}</span>
              <span className="text-sm text-neutral-500">{opt.desc}</span>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
