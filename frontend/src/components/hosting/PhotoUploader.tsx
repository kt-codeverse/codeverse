'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface FileWithPreview extends File {
  preview: string;
}

export default function PhotoUploader({
  onFilesChange,
}: {
  onFilesChange: (files: File[]) => void;
}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const createdObjectUrls = useRef<string[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(<T extends File>(acceptedFiles: T[]): void => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }, []),
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/webp': ['.webp'],
    },
    // onDrop 콜백은 useCallback으로 감싸져 있으므로,
    // createdObjectUrls.current에 직접 접근하는 것은 문제가 없습니다.
    // (ref는 렌더링과 무관하게 변경 가능)
  });

  const removeFile = (fileToRemove: FileWithPreview) => {
    // 선택된 파일을 제외한 새 배열로 상태를 업데이트합니다.
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToRemove)); // 상태 업데이트
    URL.revokeObjectURL(fileToRemove.preview); // 삭제되는 파일의 URL만 즉시 해제
    // 추적 목록에서도 제거
    createdObjectUrls.current = createdObjectUrls.current.filter(
      (url) => url !== fileToRemove.preview,
    );
  };

  // files 상태가 변경될 때마다 부모 컴포넌트로 변경 사항을 알립니다.
  useEffect(() => {
    onFilesChange(files);
    // onDrop에서 생성된 URL들을 createdObjectUrls.current에 추가
    files.forEach((file) => {
      if (!createdObjectUrls.current.includes(file.preview)) {
        createdObjectUrls.current.push(file.preview);
      }
    });
  }, [files, onFilesChange]);

  // 컴포넌트 언마운트 시 생성된 Object URL들을 정리합니다.
  // 이 방법이 여러 곳에서 revoke를 호출하는 것보다 안전하고 간단합니다.
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시, 남아있는 모든 추적된 URL을 해제
      createdObjectUrls.current.forEach((url) => URL.revokeObjectURL(url));
      createdObjectUrls.current = []; // ref 초기화
    };
  }, []);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
          isDragActive ? 'border-primary' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          {isDragActive ? (
            <p className="font-semibold text-primary">여기에 사진을 놓으세요</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">클릭 또는 드래그</span>해서
                업로드
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP (5장 이상 권장)
              </p>
            </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-square">
              <Image
                src={file.preview}
                alt={`미리보기 ${index + 1}`}
                fill
                className="object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
