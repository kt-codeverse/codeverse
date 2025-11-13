import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const parseDate = (s?: string) => (s ? new Date(s) : null);
  const [range, setRange] = useState<[Date | null, Date | null]>([
    parseDate(initialStart),
    parseDate(initialEnd),
  ]);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (start && start < today) {
      setError('오늘 이전 날짜는 선택할 수 없습니다.');
      return;
    }
    if (end && end < today) {
      setError('오늘 이전 날짜는 선택할 수 없습니다.');
      return;
    }

    if (start && end && end < start) {
      setError('체크아웃 날짜는 체크인 날짜보다 앞설 수 없습니다.');
      setRange([start, null]);
      return;
    }

    setError(null);
    setRange(dates);

    if (start && end && onSelectRange) {
      const s = format(start, 'yyyy-MM-dd');
      const e = format(end, 'yyyy-MM-dd');
      onSelectRange(s, e);
    }
  };

  const dayClassName = (date: Date) => {
    const day = date.getDay();
    if (day === 6) return 'rdp-saturday';
    if (day === 0) return 'rdp-sunday';
    return '';
  };
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-4">
      <h4 className="text-sm font-semibold mb-3 text-center">
        체크인 / 체크아웃
      </h4>

      <div className="flex flex-col gap-3">
        <DatePicker
          selected={range[0]}
          startDate={range[0]}
          endDate={range[1]}
          onChange={onChange}
          selectsRange
          inline
          monthsShown={2}
          minDate={today}
          dayClassName={dayClassName}
          locale={ko}
        />

        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}
