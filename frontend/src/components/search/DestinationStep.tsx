'use client';

import React from 'react';

/**
 * 여행지 선택 단계 컴포넌트입니다.
 * 미리 정의된 추천 여행지 목록을 보여주고, 사용자가 특정 여행지를 선택하면
 * onSelect 콜백 함수를 호출합니다.
 * @param onSelect - 사용자가 여행지를 선택했을 때 호출될 함수. 선택된 여행지 이름(string)을 인자로 받습니다.
 */
export default function DestinationStep({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  // TODO: 이 데이터는 향후 API로부터 받아오도록 수정될 수 있습니다.
  const locations = ['오사카', '강릉', '경주', '제주', '서울역'];

  return (
    <div className="p-4">
      <h4 className="text-sm font-semibold mb-3">추천 여행지</h4>

      <div className="max-h-60 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {locations.map((loc) => (
            <li
              // 각 여행지 항목 클릭 시 onSelect 콜백 실행
              key={loc}
              onClick={() => onSelect(loc)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' ? onSelect(loc) : null)}
              className="py-3 cursor-pointer px-2 hover:bg-gray-50 transition flex flex-col"
            >
              <span className="text-sm font-medium text-gray-800">{loc}</span>
              <span className="text-xs text-gray-500">대한민국</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
