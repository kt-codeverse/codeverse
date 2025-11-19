'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PhotoUploader from '@/components/hosting/PhotoUploader';

/**
 * 숙소 사진을 업로드하는 페이지입니다. (6단계)
 */
export default function Page() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFilesChange = (files: File[]) => {
    setPhotos(files);
    // TODO: 업로드된 파일 목록을 상태 관리(e.g., Zustand, Redux) 또는 상위 컴포넌트로 전달하세요.
    console.log('Uploaded photos:', files);
  };

  const handleNext = () => {
    // TODO: 다음 단계로 넘어가기 전, 업로드된 사진 정보를 서버로 전송하거나 저장하는 로직을 추가하세요.

    // 예: photos.length < 5 인 경우 경고 표시
    // if (photos.length < 5) {
    //   alert('사진을 5장 이상 업로드해주세요.');
    //   return;
    // }

    router.push('/hosting/title');
  };

  return (
    <main>
      <section className="h-screen flex flex-col border border-dashed">
        <div
          className="sm:min-w-2xl mx-auto border border-dashed 
          flex-1 py-10 flex flex-col justify-center gap-10"
        >
          <header>
            <h1 className="text-3xl font-bold tracking-tight">
              숙소 사진을 추가하세요
            </h1>
            <p className="mt-2 text-gray-600">
              6단계: 멋진 사진 5장 이상을 올려주세요.
            </p>
          </header>

          <PhotoUploader onFilesChange={handleFilesChange} />
        </div>

        <div className="py-10 flex justify-between border border-dashed">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button onClick={handleNext}>다음</Button>
        </div>
      </section>
    </main>
  );
}
