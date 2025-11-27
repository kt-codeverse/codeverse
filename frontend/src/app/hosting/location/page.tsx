'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AddressForm from '@/components/hosting/AddressForm';
import { HOSTING_STEPS, useHostingStore } from '@/store/useHostingStore';

/**
 * Daum 주소 검색 API에서 반환하는 데이터 구조에 대한 타입 정의입니다.
 * @see https://postcode.map.daum.net/guide#attributes
 */
interface DaumPostcodeData {
  address: string;
  zonecode: string;
  // 필요한 다른 속성들을 여기에 추가할 수 있습니다.
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => { open: () => void };
    };
  }
}

/**
 * 숙소의 위치(주소)를 입력받는 페이지입니다. (3단계)
 * 카카오맵 API 대신 랜덤 목업 좌표를 사용합니다.
 */
export default function Page() {
  const router = useRouter();
  const { hostingData, updateHostingData, step } = useHostingStore();

  /**
   * 주소 변경 시, 주소 문자열과 함께 랜덤 좌표를 생성하여 상태를 업데이트합니다.
   * @param main - 주소 검색으로 받은 주 주소
   * @param detail - 사용자가 입력한 상세 주소
   */
  const handleAddressChange = ({
    main,
    detail,
  }: {
    main: string;
    detail: string;
  }) => {
    const newFullAddress = `${main} ${detail}`.trim();
    if (main) {
      // 한국 내 랜덤 위도/경도 생성
      const randomLat = Math.random() * (38 - 33) + 33;
      const randomLng = Math.random() * (132 - 124) + 124;

      updateHostingData({
        location: {
          address: newFullAddress,
          lat: randomLat,
          lng: randomLng,
        },
      });
    }
  };

  const handleNext = () => {
    const currentIndex = HOSTING_STEPS.indexOf(step);
    const nextStepPath = HOSTING_STEPS[currentIndex + 1];

    if (nextStepPath) router.push(`/hosting/${nextStepPath}`);
  };

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
      <main>
        <section className="h-screen flex flex-col border/ border-dashed/">
          <div className="max-w-4xl mx-auto flex-1 py-10 flex flex-col items-center justify-center gap-10">
            <header className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                숙소 위치는 어디인가요?
              </h1>
              <p className="mt-2 text-gray-600">
                3단계: 정확한 주소를 입력해주세요.
              </p>
            </header>

            <AddressForm onAddressChange={handleAddressChange} />
          </div>

          <div className="py-10 flex justify-between border/ border-dashed/">
            <Button variant="ghost" onClick={() => router.back()}>
              이전
            </Button>
            <Button
              onClick={handleNext}
              disabled={!hostingData.location?.address}
            >
              다음
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
