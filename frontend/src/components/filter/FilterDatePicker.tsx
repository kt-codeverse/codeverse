'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar, ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatePicker from 'react-datepicker';
import { useState, useMemo } from 'react';
import { ko } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

export default function FilterDatePicker({
  checkIn,
  checkOut,
  onRangeChange,
}: {
  checkIn: string;
  checkOut: string;
  onRangeChange: (dates: [string, string]) => void;
}) {
  const parseDate = (s?: string) => (s ? new Date(s) : null);
  const [range, setRange] = useState<[Date | null, Date | null]>([
    parseDate(checkIn),
    parseDate(checkOut),
  ]);
  const [startDate, endDate] = range;
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setRange(dates);

    if (start && end) {
      onRangeChange([format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd')]);
    }
  };

  const dayClassName = (date: Date) => {
    const day = date.getDay();
    if (day === 6) return 'saturday text-red-500!';
    if (day === 0) return 'sunday text-blue-500!';
    return '';
  };

  const label = checkIn && checkOut ? `${checkIn} ~ ${checkOut}` : '날짜 선택';

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-[280px] justify-start text-left font-normal"
          >
            <div className="flex-1 flex items-center gap-2">
              <Calendar />
              {label}
            </div>
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-4 overflow-hidden shadow-2xl scale-105"
          align="start"
        >
          <DatePicker
            selected={startDate}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            selectsRange
            inline
            monthsShown={2}
            minDate={today}
            locale={ko}
            dayClassName={dayClassName}
            calendarClassName={cn('rounded-none! border-0! flex! shadow-none!')}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
