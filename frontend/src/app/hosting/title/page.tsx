'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import TitleForm from '@/components/hosting/TitleForm';

/**
 * 숙소의 이름을 정하는 페이지입니다. (7단계, 마지막)
 */
export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleDataChange = useCallback(
    (data: { title: string; description: string }) => {
      setFormData(data);
    },
    [],
  );

  const handleComplete = () => {
    // TODO: Zustand 스토어에 저장된 모든 호스팅 데이터를 취합하여 서버로 전송하는 API를 호출합니다.
    if (!formData.title.trim()) {
      alert('숙소 이름을 입력해주세요.');
      return;
    }
    console.log('최종 호스팅 데이터:', {
      // ... 이전 단계 데이터들
      ...formData,
    });
    alert('호스팅 등록이 완료되었습니다!');
    router.push('/'); // 메인 페이지 또는 호스팅 관리 페이지로 이동
  };

  return (
    <main>
      <section className="h-screen flex flex-col">
        <div
          className="max-w-4xl mx-auto border border-dashed 
          flex-1 py-10 flex flex-col justify-center gap-10"
        >
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              숙소 이름 정하기
            </h1>
            <p className="mt-2 text-gray-600">
              7단계: 게스트가 검색할 때 표시될 멋진 이름을 만들어보세요.
            </p>
          </header>
          <TitleForm onDataChange={handleDataChange} />
        </div>

        <div className="py-10 flex justify-between border border-dashed">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button onClick={handleComplete}>호스팅 완료하기</Button>
        </div>
      </section>
    </main>
  );
}
