'use client';

import { useSearchParams } from 'next/navigation';

export default function SearchClient() {
  const params = useSearchParams();
  const destination = params.get('destination') ?? '';
  const start = params.get('start') ?? '';
  const end = params.get('end') ?? '';
  const guests = params.get('guests') ?? '';

  // Dummy results based on params
  const items = new Array(8).fill(null).map((_, i) => ({
    id: i + 1,
    title: `${destination || '추천'} 숙소 ${i + 1}`,
    subtitle: `${start}${start && end ? ` — ${end}` : ''} · 최대 ${
      guests || 2
    }명`,
  }));

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold mb-4">검색 결과</h1>
      <div className="mb-6 text-sm text-gray-600">
        {destination && (
          <span className="mr-4">
            여행지: <strong>{destination}</strong>
          </span>
        )}
        {start && end && (
          <span className="mr-4">
            날짜: <strong>{start}</strong> → <strong>{end}</strong>
          </span>
        )}
        {guests && (
          <span>
            인원: <strong>{guests}명</strong>
          </span>
        )}
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((it) => (
          <li
            key={it.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="text-lg font-medium">{it.title}</div>
            <div className="text-sm text-gray-500 mt-1">{it.subtitle}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
