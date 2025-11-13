'use client';

import React from 'react';

export default function DestinationStep({
  onSelect,
}: {
  onSelect: (v: string) => void;
}) {
  const locations = ['서울', '부산', '제주', '강릉', '가평'];

  return (
    <div className="p-4">
      <h4 className="text-sm font-semibold mb-3">추천 여행지</h4>

      {/* 세로 스크롤 텍스트 리스트: 가독성 좋게 위아래로 스크롤 */}
      <div className="max-h-60 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
          {locations.map((loc) => (
            <li
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
