'use client';
'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * 여행자 수 선택 단계 컴포넌트입니다.
 * 플러스/마이너스 버튼으로 인원 수를 조절하고, '완료' 버튼으로 선택을 확정합니다.
 * @param guests - 현재 설정된 여행자 수
 * @param onChange - 여행자 수가 변경될 때 호출될 함수
 * @param onSave - '완료' 버튼 클릭 시 호출될 함수
 */
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
          // 최소 인원은 1명으로 제한
          onClick={() => onChange(Math.max(1, guests - 1))}
          aria-label="감소"
          className="p-1 border rounded-md flex items-center justify-center"
        >
          <Minus size={16} />
        </button>

        <span className="text-sm font-medium px-2">{guests}명</span>

        <button
          // 최대 인원 제한은 현재 없음
          onClick={() => onChange(guests + 1)}
          aria-label="증가"
          className="p-1 border rounded-md flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="shrink-0">
        <button
          // '완료' 버튼 클릭 시 드롭다운을 닫도록 onSave 콜백 호출
          onClick={onSave}
          className="bg-[#FF385C] text-sm text-white px-3 py-1 rounded"
        >
          완료
        </button>
      </div>
    </div>
  );
}
