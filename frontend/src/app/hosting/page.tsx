'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();

  const handleStartHosting = () => {
    router.push('/hosting/structure');
  };

  return (
    <main>
      <section className="h-screen flex flex-col items-stretch justify-between px-4">
        <div className="h-full flex flex-col md:flex-row items-center gap-10 border/ border-dashed/">
          <div className="flex-1">
            <h1 className="max-w-lg mx-auto text-7xl font-semibold tracking-tight py-10">
              간단하게 호스팅을 시작할 수 있습니다
            </h1>
          </div>

          <div className="flex-1">
            <ol className="flex flex-col gap-6 [&_>_li]:pb-10">
              <li className="flex flex-col gap-1">
                <strong className="font-semibold">
                  1. 숙소 정보를 알려주세요
                </strong>
                <p className="text-gray-600">
                  숙소 위치와 숙박 가능 인원 등 기본 정보를 알려주세요.
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <strong className="font-semibold">
                  2. 숙소를 돋보이게 하세요
                </strong>
                <p className="text-gray-600">
                  사진을 5장 이상 제출하고 제목과 설명을 추가해주시면 숙소가
                  돋보일 수 있도록 도와드릴게요.
                </p>
              </li>
              <li className="flex flex-col gap-1">
                <strong className="font-semibold">3. 등록을 완료하세요</strong>
                <p className="text-gray-600">
                  호스팅 초기에 적용할 요금을 설정하고, 세부정보를 인증한 다음
                  리스팅을 게시하세요.
                </p>
              </li>
            </ol>
          </div>
        </div>

        <div className="py-10 flex justify-end border/ border-dashed/">
          <Button onClick={handleStartHosting}>시작하기</Button>
        </div>
      </section>
    </main>
  );
}
