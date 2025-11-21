import { Suspense } from 'react';
import SearchClient from './SearchClient';

export default function SearchPage() {
  return (
    <main>
      <section>
        <h1 className="text-2xl font-semibold mb-4">검색 결과</h1>
        <Suspense fallback={<div>로딩 중...</div>}>
          {/* Client component handles useSearchParams and client-only logic */}
          <SearchClient />
        </Suspense>
      </section>
    </main>
  );
}
