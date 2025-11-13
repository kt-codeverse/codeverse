'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

export default function DateSelector() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex flex-col space-y-2 w-[250px]">
      <label className="text-sm font-medium">예약 날짜</label>
      <div className="relative">
        <input
          type="date"
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value ?? null)}
          className="w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="날짜 선택"
        />
        <Calendar
          className="absolute right-3 top-2.5 text-gray-400"
          size={18}
        />
      </div>
    </div>
  );
}
