'use client';

import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import SearchDropdown from './SearchDropdown';
import DestinationStep from './DestinationStep';
import DateStep from './DateStep';
import GuestStep from './GuestStep';

export default function SearchBar() {
  const [step, setStep] = useState<
    'default' | 'destination' | 'dates' | 'guests'
  >('default');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [guests, setGuests] = useState(1);

  const expand = step !== 'default';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={containerRef} className="w-full min-w-0">
      <div
        className={`flex items-center bg-white border border-gray-300 rounded-full shadow-sm transition-all duration-300 ${
          expand ? 'py-3 scale-105 shadow-lg' : 'py-2 hover:shadow-md'
        }`}
      >
        {/* left: destination */}
        <div
          ref={leftRef}
          className="flex-none min-w-40 px-4 pr-6 border-r border-gray-200"
        >
          <button
            onClick={() => setStep('destination')}
            className="w-full text-left"
            aria-label="여행지 선택"
          >
            <div className="text-xs text-gray-500">여행지</div>
            <div className="text-sm text-gray-800 truncate">
              {destination || '여행지 검색'}
            </div>
          </button>
        </div>

        {/* center: dates */}
        <div ref={centerRef} className="flex-1 px-4 border-r border-gray-200">
          <button
            onClick={() => setStep('dates')}
            className="w-full text-left"
            aria-label="체크인 / 체크아웃"
          >
            <div className="text-xs text-gray-500">체크인 / 체크아웃</div>
            <div className="text-sm text-gray-800 truncate">
              {dates.start && dates.end
                ? `${dates.start} ~ ${dates.end}`
                : '날짜 추가'}
            </div>
          </button>
        </div>

        {/* right: guests + search */}
        <div
          ref={rightRef}
          className="flex-none min-w-[180px] flex items-center justify-between gap-3 px-4"
        >
          <button
            onClick={() => setStep('guests')}
            className="text-left flex-1"
            aria-label="여행자 선택"
          >
            <div className="text-xs text-gray-500">여행자</div>
            <div className="text-sm text-gray-800 truncate">
              {guests >= 1 ? `${guests}명` : '게스트 추가'}
            </div>
          </button>

          <button
            disabled
            className="bg-gray-300 text-white rounded-full p-2 shrink-0 cursor-not-allowed"
            aria-label="검색 (비활성)"
            aria-disabled="true"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* 드롭다운 단계 */}
      <SearchDropdown
        open={step !== 'default'}
        onClose={() => setStep('default')}
        anchorRef={
          step === 'destination'
            ? leftRef
            : step === 'dates'
            ? centerRef
            : step === 'guests'
            ? rightRef
            : containerRef
        }
        align={step === 'dates' ? 'center' : 'right'}
        preferredWidth={
          step === 'destination'
            ? 300
            : step === 'dates'
            ? 520
            : step === 'guests'
            ? 200
            : undefined
        }
      >
        {step === 'destination' && (
          <DestinationStep
            onSelect={(loc: string) => {
              setDestination(loc);
              setStep('dates');
            }}
          />
        )}

        {step === 'dates' && (
          <DateStep
            initialStart={dates.start}
            initialEnd={dates.end}
            onSelectRange={(start: string, end: string) => {
              setDates({ start, end });
              setStep('guests');
            }}
          />
        )}

        {step === 'guests' && (
          <GuestStep
            guests={guests}
            onChange={(g: number) => setGuests(g)}
            onSave={() => setStep('default')}
          />
        )}
      </SearchDropdown>
    </div>
  );
}
