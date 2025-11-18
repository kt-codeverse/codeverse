'use client';

import { useRef, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchDropdown from './SearchDropdown';
import DestinationStep from './DestinationStep';
import DateStep from './DateStep';
import GuestStep from './GuestStep';

/**
 * 메인 페이지 상단에 위치하는 검색 바 컴포넌트입니다.
 * 여행지, 날짜, 인원 수 선택을 단계별로 처리하며, 모든 정보가 입력되면 검색을 실행합니다.
 */
export default function SearchBar() {
  // 'default': 기본 상태, 'destination': 여행지 선택, 'dates': 날짜 선택, 'guests': 인원 수 선택
  const [step, setStep] = useState<
    'default' | 'destination' | 'dates' | 'guests'
  >('default');

  // 검색 관련 상태
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState({ start: '', end: '' });
  const [guests, setGuests] = useState(1);

  const router = useRouter();
  // 검색 바가 확장되었는지 (어느 단계든 선택된 상태) 여부
  const expand = step !== 'default';

  // 각 검색 단계별 UI 요소에 대한 참조. 드롭다운 위치 계산에 사용됩니다.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  // 모든 검색 조건이 충족되었는지 확인하여 검색 버튼 활성화 여부를 결정합니다.
  const isSearchReady = useMemo(() => {
    return !!(destination && dates.start && dates.end && guests > 0);
  }, [destination, dates, guests]);

  /**
   * 검색 버튼 클릭 시 실행되는 핸들러입니다.
   * 현재까지 입력된 검색 데이터를 콘솔에 로깅하고,
   * 쿼리 파라미터와 함께 검색 결과 페이지('/search')로 이동합니다.
   */
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
      {/* 검색 바 UI */}
      <div
        // 검색 단계(step)에 따라 동적으로 스타일이 변경됩니다. (확장/축소 효과)
        className={`relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm transition-all duration-300 ${
          expand ? 'py-2/ scale-105/ shadow-lg' : 'py-2/ hover:shadow-md'
        }`}
      >
        {/* 여행지 선택 섹션 */}
        <div ref={leftRef} className="flex-none min-w-40">
          <button
            // '여행지' 섹션 클릭 시 'destination' 단계로 설정
            onClick={() => setStep('destination')}
            className={`w-full h-full block text-left rounded-full px-5 pr-8 py-3 transition-colors duration-150 relative z-0 ${
              step === 'destination' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            aria-label="여행지 선택"
          >
            <div className="text-xs text-gray-500">여행지</div>
            <div className="text-sm text-gray-800 truncate">
              {destination || '여행지 검색'}
            </div>
          </button>
        </div>

        {/* 왼쪽과 중앙 섹션을 나누는 시각적 구분선 */}
        <div
          className="flex-none w-px h-6 bg-gray-300 z-50 pointer-events-none"
          aria-hidden
        />

        {/* 날짜 선택 섹션 */}
        <div ref={centerRef} className="flex-1">
          <button
            // '날짜' 섹션 클릭 시 'dates' 단계로 설정
            onClick={() => setStep('dates')}
            className={`w-full h-full text-left rounded-full px-5 py-3 transition-colors duration-150 relative z-0 ${
              step === 'dates' ? 'bg-gray-200' : 'hover:bg-gray-100'
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

        {/* 중앙과 오른쪽 섹션을 나누는 시각적 구분선 */}
        <div
          className="flex-none w-px h-6 bg-gray-300 z-50 pointer-events-none"
          aria-hidden
        />

        {/* 여행자 수 선택 및 검색 버튼 섹션 */}
        <div
          ref={rightRef}
          className="flex-none min-w-[180px] flex items-center justify-between gap-3"
        >
          {/* 여행자 수 버튼 */}
          <button
            // '여행자' 섹션 클릭 시 'guests' 단계로 설정
            onClick={() => setStep('guests')}
            className={`text-left flex-1 h-full rounded-full px-5 py-3 transition-colors duration-150 relative z-0 ${
              step === 'guests' ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            aria-label="여행자 선택"
          >
            <div className="text-xs text-gray-500">여행자</div>
            <div className="text-sm text-gray-800 truncate">
              {guests >= 1 ? `${guests}명` : '게스트 추가'}
            </div>
          </button>

          {/* 검색 실행 버튼 */}
          <button
            // 검색 실행 버튼
            onClick={handleSearch}
            disabled={!isSearchReady}
            className="bg-[#FF385C] text-white rounded-full p-2
            shrink-0 mr-4 transition-colors hover:brightness-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
            aria-label="검색"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* 검색 단계별 드롭다운 UI */}
      <SearchDropdown
        open={step !== 'default'}
        onClose={() => setStep('default')}
        // 현재 단계에 따라 드롭다운의 기준(anchor) 요소를 동적으로 설정
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
        // 현재 단계에 따라 드롭다운의 선호 너비를 설정
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
        {/* 현재 단계에 맞는 컴포넌트를 렌더링 */}
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
