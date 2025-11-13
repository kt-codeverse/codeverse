'use client';

import React, { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function DateStep({
  onSelectRange,
  initialStart,
  initialEnd,
}: {
  onSelectRange?: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
}) {
  const [range, setRange] = useState<DateRange | undefined>(() => {
    try {
      if (initialStart && initialEnd) {
        return { from: new Date(initialStart), to: new Date(initialEnd) };
      }
      if (initialStart) {
        return { from: new Date(initialStart), to: undefined };
      }
    } catch {
      // if parsing fails, fall back to undefined
    }
    return undefined;
  });
  const [error, setError] = useState<string | null>(null);

  // keep onSave available for keyboard/explicit save flow but not used in the default UI

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="p-4">
      <h4 className="text-sm font-semibold mb-3">체크인 / 체크아웃</h4>

      <div className="flex flex-col gap-4">
        <DayPicker
          mode="range"
          selected={range}
          locale={ko}
          disabled={{ before: today }}
          modifiers={{
            // saturday = 6, sunday = 0
            saturday: (d: Date) => d.getDay() === 6,
            sunday: (d: Date) => d.getDay() === 0,
          }}
          onDayClick={(day) => {
            // ignore clicks on past days
            const clicked = new Date(day);
            clicked.setHours(0, 0, 0, 0);
            if (clicked < today) return;

            setError(null);
            // no selection yet -> set check-in
            if (!range || !range.from) {
              setRange({ from: day, to: undefined });
              return;
            }

            // have check-in but no check-out -> try to set check-out
            if (range.from && !range.to) {
              // if clicked day is before check-in, show error and reset
              if (day < range.from) {
                setError('체크아웃 날짜는 체크인 날짜보다 앞설 수 없습니다.');
                // reset selection so user must re-select
                setRange(undefined);
                return;
              }
              const newRange = { from: range.from, to: day };
              setRange(newRange);
              const s = format(newRange.from as Date, 'yyyy-MM-dd');
              const e = format(newRange.to as Date, 'yyyy-MM-dd');
              if (onSelectRange) onSelectRange(s, e);
              return;
            }

            // both exist -> start a new selection from clicked day
            setRange({ from: day, to: undefined });
          }}
          numberOfMonths={2}
          // custom inline styles for selected range to mimic Airbnb look
          modifiersStyles={{
            selected: {
              background: '#111827',
              color: '#fff',
              borderRadius: '9999px',
            },
            range_start: {
              background: '#111827',
              color: '#fff',
              borderTopLeftRadius: '9999px',
              borderBottomLeftRadius: '9999px',
            },
            range_end: {
              background: '#111827',
              color: '#fff',
              borderTopRightRadius: '9999px',
              borderBottomRightRadius: '9999px',
            },
            today: {
              background: '#7b3aed',
              color: '#fff',
              borderRadius: '9999px',
            },
            range_middle: { background: '#F3F4F6' },
            disabled: {
              color: '#9CA3AF',
              background: 'transparent',
              cursor: 'not-allowed',
            },
            saturday: { color: '#2563EB' },
            sunday: { color: '#EF4444' },
          }}
        />
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
