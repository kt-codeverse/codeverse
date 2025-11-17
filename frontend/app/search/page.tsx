import React, { Suspense } from 'react';
import SearchClient from './searchclient';

export default function Page() {
  return (
    <Suspense fallback={<div className="py-8 text-center">로딩 중...</div>}>
      <SearchClient />
    </Suspense>
  );
}
