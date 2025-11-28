'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HOSTING_STEPS, useHostingStore } from '@/store/useHostingStore';
import PhotoUploader from '@/components/hosting/PhotoUploader';

/**
 * 숙소 사진을 업로드하는 페이지입니다. (6단계)
 */
export default function Page() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const updateHostingData = useHostingStore((state) => state.updateHostingData);
  const step = useHostingStore((state) => state.step);

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0 && files.length < 5) {
      setError('사진을 5장 이상 업로드해주세요.');
    } else {
      setError(null);
    }
  };

  /**
   * FormData를 서버로 전송하여 사진을 업로드합니다.
   * @param formData - 업로드할 파일이 담긴 FormData 객체
   * @returns 서버로부터 받은 Photo 객체 배열
   */
  const uploadPhotos = async (formData: FormData) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/images`;
    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('사진 업로드에 실패했습니다.');
    return response.json();
  };

  const handleNext = async () => {
    // if (selectedFiles.length < 5) {
    //   setError('사진을 5장 이상 업로드해주세요.');
    //   return;
    // }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const newPhotos = await uploadPhotos(formData);
      updateHostingData({ photos: newPhotos });

      const currentIndex = HOSTING_STEPS.indexOf(step);
      const nextStepPath = HOSTING_STEPS[currentIndex + 1];
      if (nextStepPath) {
        router.push(`/hosting/${nextStepPath}`);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : '사진 업로드 중 오류가 발생했습니다.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main>
      <section className="h-screen flex flex-col border/ border-dashed/">
        <div
          className="sm:min-w-2xl mx-auto border/ border-dashed/ 
          flex-1 py-10 flex flex-col justify-center gap-10"
        >
          <header>
            <h1 className="text-3xl font-bold tracking-tight">
              숙소 사진을 추가하세요
            </h1>
            <p className="mt-2 text-gray-600 opacity-30">
              6단계: 멋진 사진 5장 이상을 올려주세요.
            </p>
            <p className="mt-2 text-red-600">
              개발 중이니 사진 1장만 업로드해주세요.
            </p>
          </header>

          <PhotoUploader onFilesChange={handleFilesChange} />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="py-10 flex justify-between border/ border-dashed/">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              isUploading
              // 실제 배포에서는 아래로 사용
              // isUploading || selectedFiles.length < 5
            }
          >
            {isUploading ? '업로드 중...' : '다음'}
          </Button>
        </div>
      </section>
    </main>
  );
}
