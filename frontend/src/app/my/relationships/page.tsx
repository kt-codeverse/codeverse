'use client';

import { useEffect, useState } from 'react';
import { http } from '@/src/lib/http';
import Link from 'next/link';

type Person = {
  id: string;
  name: string;
};

export default function MyRelationships() {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await http.get('/relationships');
        setPeople(res.data);
      } catch {
        // 백엔드 없을 때 기본값: 빈 상태로 보여주기
        setPeople([]);
      }
    })();
  }, []);

  // 👉 아무 인연도 없을 때 (기본 안내 화면)
  if (!people.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <p className="text-gray-600 text-sm leading-relaxed mt-8">
          체험에 참여하거나 여행에 일행을 초대하면,
          <br />
          다른 게스트의 정보가 여기에 표시됩니다.
        </p>

        <Link
          href="/explore"
          className="mt-6 inline-block rounded-full bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          여행 예약
        </Link>

        <p className="mt-2 text-xs text-gray-500 underline hover:text-gray-700 cursor-pointer">
          자세히 알아보기
        </p>
      </div>
    );
  }

  // 👉 인연 목록 있을 때 (사진 없이 이름만)
  return (
    <ul className="space-y-4">
      {people.map((p) => (
        <li
          key={p.id}
          className="flex items-center gap-3 rounded-xl border p-4 hover:bg-gray-50"
        >
          <span className="font-medium">{p.name}</span>
        </li>
      ))}
    </ul>
  );
}
