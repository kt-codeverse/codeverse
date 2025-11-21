'use client';

//import * as Dialog from '@radix-ui/react-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface Props {
  fullText: string;
}

export default function RoomDescription({ fullText }: Props) {
  const PREVIEW_LENGTH = 200;
  const isLong = fullText.length > PREVIEW_LENGTH;
  const previewText = isLong
    ? fullText.slice(0, PREVIEW_LENGTH) + '...'
    : fullText;

  return (
    <div className="py-6 ">
      <p className="text-gray-700 whitespace-pre-line">{previewText}</p>

      {isLong && (
        <Dialog>
          {/* 더보기 버튼 */}
          <DialogTrigger asChild>
            <button className="h-12 w-[110px] mt-4 text-gray-700 font-medium rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              더 보기
            </button>
          </DialogTrigger>

          {/* 모달 내용 */}
          <DialogContent
            forceMount
            className="
               sm:max-w-2xl
              "
          >
            <DialogTitle className="text-3xl font-semibold mb-4">
              숙소 설명
            </DialogTitle>

            {/* 접근성용 Description: 텍스트만 넣음 (sr-only로 숨김) */}
            <DialogDescription className="sr-only">
              {previewText} {/* 혹은 간단한 요약 문구 */}
            </DialogDescription>

            {/* 시각적으로 보여줄 전체 내용 */}
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {fullText}
            </p>

            {/* 닫기 버튼 */}
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button className="px-5 py-2 w-[70px]">닫기</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
