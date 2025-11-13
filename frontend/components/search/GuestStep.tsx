'use client';
'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function GuestStep({
  guests,
  onChange,
  onSave,
}: {
  guests: number;
  onChange: (v: number) => void;
  onSave: () => void;
}) {
  return (
    <div className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(1, guests - 1))}
          aria-label="감소"
          className="p-1 border rounded-md flex items-center justify-center"
        >
          <Minus size={16} />
        </button>

        <span className="text-sm font-medium px-2">{guests}명</span>

        <button
          onClick={() => onChange(guests + 1)}
          aria-label="증가"
          className="p-1 border rounded-md flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="shrink-0">
        <button
          onClick={onSave}
          className="bg-[#FF385C] text-sm text-white px-3 py-1 rounded"
        >
          완료
        </button>
      </div>
    </div>
  );
}
