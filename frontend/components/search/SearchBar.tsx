'use client';

import { useRef, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import SearchDropdown from './SearchDropdown';
import DestinationStep from './DestinationStep';
import DateStep from './DateStep';
import GuestStep from './GuestStep';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [step, setStep] = useState<
    'default' | 'destination' | 'dates' | 'guests'
  >('default');
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [guests, setGuests] = useState(1);

  const router = useRouter();
  const expand = step !== 'default';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const isSearchReady = useMemo(() => {
    return !!(destination && dates.start && dates.end && guests > 0);
  }, [destination, dates, guests]);

  const handleSearch = () => {
    console.log('검색 데이터:', {
      destination,
      dates,
      guests,
    });

    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (dates.start) params.set('start', dates.start);
    if (dates.end) params.set('end', dates.end);
    if (guests) params.set('guests', guests.toString());

    router.push(`/search?${params.toString()}`);
  };
  return (
    <div ref={containerRef} className="max-w-4xl mx-auto min-w-0">
      <div
        className={`relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm transition-all duration-300 ${
          expand ? 'py-3 scale-105 shadow-lg' : 'py-2 hover:shadow-md'
        }`}
      >
        <div ref={leftRef} className="flex-none min-w-40">
          <button
            onClick={() => setStep('destination')}
            className={`w-full h-full block text-left rounded-l-full rounded-r-none px-4 pr-6 py-2.5 transition-colors duration-150 relative z-0 ${
              step === 'destination' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            aria-label="여행지 선택"
          >
            <div className="text-xs text-gray-500">여행지</div>
            <div className="text-sm text-gray-800 truncate">
              {destination || '여행지 검색'}
            </div>
          </button>
        </div>

        {/* separator between left and center (visual divider) */}
        <div
          className="flex-none w-px h-6 bg-gray-300 z-50 pointer-events-none"
          aria-hidden
        />

        <div ref={centerRef} className="flex-1">
          <button
            onClick={() => setStep('dates')}
            className={`w-full h-full text-left rounded-none px-4 py-2.5 transition-colors duration-150 relative z-0 ${
              step === 'dates' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
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

        {/* separator between center and right (visual divider) */}
        <div
          className="flex-none w-px h-6 bg-gray-300 z-50 pointer-events-none"
          aria-hidden
        />

        <div
          ref={rightRef}
          className="flex-none min-w-[180px] flex items-center justify-between gap-3"
        >
          <button
            onClick={() => setStep('guests')}
            className={`text-left flex-1 h-full rounded-r-full rounded-l-none px-4 py-2.5 transition-colors duration-150 relative z-0 ${
              step === 'guests' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            aria-label="여행자 선택"
          >
            <div className="text-xs text-gray-500">여행자</div>
            <div className="text-sm text-gray-800 truncate">
              {guests >= 1 ? `${guests}명` : '게스트 추가'}
            </div>
          </button>

          <button
            onClick={handleSearch}
            disabled={!isSearchReady}
            className="bg-[#FF385C] text-white rounded-full p-2 shrink-0 mr-4 transition-opacity hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-label="검색"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

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
