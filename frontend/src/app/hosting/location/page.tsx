'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AddressForm from '@/components/hosting/AddressForm';

// Daum Postcode 서비스의 window 객체 타입 확장
declare global {
  interface Window {
    daum: any;
  }
}

/**
 * 숙소의 위치를 지도에 표시하고 주소를 입력하는 페이지입니다. (3단계)
 */
export default function Page() {
  const router = useRouter();
  const [address, setAddress] = useState({ main: '', detail: '' });

  const handleAddressChange = (newAddress: {
    main: string;
    detail: string;
  }) => {
    setAddress(newAddress);
    console.log('입력된 주소:', newAddress); // 개발 중 확인용
  };

  const handleNext = () => {
    router.push('/hosting/floor-plan');
  };

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
      <main>
        <section className="h-screen flex flex-col border border-dashed">
          <div
            className="max-w-4xl mx-auto border border-dashed
            flex-1 py-10 flex flex-col items-center justify-center gap-10"
          >
            <header className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                숙소 위치는 어디인가요?
              </h1>
              <p className="mt-2 text-gray-600">3단계: 주소를 입력해주세요.</p>
            </header>

            <AddressForm onAddressChange={handleAddressChange} />
          </div>

          <div className="py-10 flex justify-between border border-dashed">
            <Button variant="ghost" onClick={() => router.back()}>
              이전
            </Button>
            <Button onClick={handleNext}>다음</Button>
          </div>
        </section>
      </main>
    </>
  );
}
