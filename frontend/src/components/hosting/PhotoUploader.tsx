'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface PhotoUploaderProps {
  onFilesChange: (files: File[]) => void;
}

interface FileWithPreview extends File {
  preview: string;
}

/**
 * 숙소 사진을 업로드하기 위한 드래그 앤 드롭 컴포넌트입니다.
 * 이미지 미리보기와 삭제 기능을 제공합니다.
 * @param {PhotoUploaderProps} props - onFilesChange: 파일 목록이 변경될 때 호출되는 콜백 함수
 */
export default function PhotoUploader({ onFilesChange }: PhotoUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    <T extends File>(
      acceptedFiles: T[],
      fileRejections: FileRejection[],
      event: DropEvent,
    ): void => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setFiles((prevFiles) => {
        const updatedFiles = [...prevFiles, ...newFiles];
        onFilesChange(updatedFiles);
        return updatedFiles;
      });
    },
    [onFilesChange],
  );

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file !== fileToRemove);
      onFilesChange(updatedFiles);
      URL.revokeObjectURL(fileToRemove.preview); // 메모리 누수 방지
      return updatedFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/webp': ['.webp'],
    },
  });

  // 컴포넌트 언마운트 시 생성된 Object URL들을 정리합니다.
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

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
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }} // next/image 로드 후 revoke
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
