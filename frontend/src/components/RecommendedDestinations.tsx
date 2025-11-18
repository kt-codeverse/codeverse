'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RecommendedDestinations() {
  const [activeTab, setActiveTab] = useState('popular');

  const destinations = [
    { name: '포틀랜드', type: '독채 숙소', href: '/portland-me/stays/houses' },
    {
      name: '로스앤젤레스',
      type: '아파트 숙소',
      href: '/los-angeles-ca/stays/apartments',
    },
    {
      name: '브레켄리지',
      type: '장기 숙소',
      href: '/breckenridge-co/stays/monthly',
    },
    { name: '마이애미', type: '휴가지 숙소', href: '/miami-fl/stays' },
    {
      name: '카일루아코나',
      type: '아파트 숙소',
      href: '/kailua-kona-hi/stays/apartments',
    },
    { name: '방콕', type: '휴가지 숙소', href: '/bangkok-thailand/stays' },
    {
      name: '루이스빌',
      type: '장기 숙소',
      href: '/louisville-ky/stays/monthly',
    },
    { name: '휴스턴', type: '통나무집 숙소', href: '/houston-tx/stays/cabins' },
  ];

  return (
    <section className="w-full px-6 py-10">
      {/* 제목 */}
      <h2 className="text-2xl font-semibold mb-6">
        다음 여행을 위한 추천 여행지
      </h2>

      {/* 탭 영역 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'popular'}
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeTab === 'popular'
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            인기
          </button>
          {/* 필요 시 다른 탭 추가 */}
        </div>

        {/* 오른쪽 화살표 버튼 */}
        <button
          type="button"
          aria-label="스크롤하면 오른쪽으로 이동"
          className="p-2 text-gray-600 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-4 h-4 stroke-current stroke-[3]"
            fill="none"
          >
            <path d="m12 4 11.3 11.3a1 1 0 0 1 0 1.4L12 28" />
          </svg>
        </button>
      </div>

      {/* 추천 여행지 목록 */}
      <div role="tabpanel" aria-labelledby="tab--popular">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((d) => (
            <li key={d.href}>
              <Link
                // href={d.href}
                href="#"
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{d.name}</span>{' '}
                {d.type}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
