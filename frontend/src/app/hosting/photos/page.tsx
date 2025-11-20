'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PhotoUploader from '@/components/hosting/PhotoUploader';

/**
 * 숙소 사진을 업로드하는 페이지입니다. (6단계)
 */
export default function Page() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFilesChange = useCallback(
    (files: File[]) => {
      setPhotos(files);
    },
    [setPhotos],
  );

  /**
   * '다음' 버튼 클릭 시 실행되는 핸들러입니다.
   * 선택된 사진 파일들을 서버로 업로드합니다.
   */
  const handleNext = async () => {
    // 이전 에러 메시지 초기화
    setError(null);

    // 유효성 검사: 최소 5장의 사진 필요
    // if (photos.length < 5) {
    //   setError('사진을 5장 이상 업로드해주세요.');
    //   return;
    // }

    startTransition(async () => {
      try {
        const formData = new FormData();
        photos.forEach((photo) => {
          // 'files' 키는 NestJS의 FilesInterceptor와 일치해야 합니다.
          formData.append('files', photo);
        });

        const data = await uploadPhotos(formData);

        // TODO: 응답 데이터(이미지 URL 등)를 상태 관리 또는 다음 페이지로 전달할 수 있습니다.
        console.log('Upload successful:', data);

        router.push('/hosting/title');
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('알 수 없는 오류가 발생했습니다.');
        }
      }
    });
  };

  /**
   * FormData를 서버로 전송하여 사진을 업로드합니다.
   * @param formData - 업로드할 파일이 담긴 FormData 객체
   * @returns 서버로부터 받은 JSON 응답
   */
  const uploadPhotos = async (formData: FormData) => {
    const response = await fetch('http://localhost:8080/api/uploads/images', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      // 서버에서 구체적인 에러 메시지를 보냈을 경우를 대비
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || '사진 업로드에 실패했습니다.');
    }

    return response.json();
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

        <div className="py-10 flex justify-between border border-dashed">
          <Button variant="ghost" onClick={() => router.back()}>
            이전
          </Button>
          <Button onClick={handleNext} disabled={isPending}>
            {isPending ? '업로드 중...' : '다음'}
          </Button>
        </div>
      </section>
    </main>
  );
}
