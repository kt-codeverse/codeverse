import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜(체크인/체크아웃) 선택 단계 컴포넌트입니다.
 * react-datepicker를 사용하여 달력 UI를 제공하고, 사용자가 날짜 범위를 선택할 수 있도록 합니다.
 * @param onSelectRange - 사용자가 유효한 날짜 범위를 선택했을 때 호출될 함수. 시작일과 종료일을 'yyyy-MM-dd' 형식의 문자열로 받습니다.
 * @param initialStart - 이전에 선택했던 시작일 (초기값)
 * @param initialEnd - 이전에 선택했던 종료일 (초기값)
 */
export default function DateStep({
  onSelectRange,
  initialStart,
  initialEnd,
}: {
  onSelectRange?: (start: string, end: string) => void;
  initialStart?: string;
  initialEnd?: string;
}) {
  // 문자열 형태의 날짜를 Date 객체로 파싱합니다.
  const parseDate = (s?: string) => (s ? new Date(s) : null);

  // [시작일, 종료일]을 관리하는 상태
  const [range, setRange] = useState<[Date | null, Date | null]>([
    parseDate(initialStart),
    parseDate(initialEnd),
  ]);
  // 날짜 선택 관련 오류 메시지를 관리하는 상태
  const [error, setError] = useState<string | null>(null);

  // 오늘 날짜 (시간은 0으로 설정)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  /**
   * DatePicker의 날짜가 변경될 때 호출되는 핸들러입니다.
   * 날짜 유효성을 검사하고, 유효한 경우 상태를 업데이트하고 onSelectRange 콜백을 호출합니다.
   */
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

  /**
   * 주말(토, 일)에 특정 CSS 클래스를 적용하기 위한 함수입니다.
   */
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
          // react-datepicker 설정
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
