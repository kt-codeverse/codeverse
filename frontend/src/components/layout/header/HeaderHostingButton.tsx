'use client';
import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type HostingType = 'rooms' | 'experience' | 'services';

interface HostingTypeOption {
  type: HostingType;
  label: string;
  src: string;
  alt: string;
}

const hostingTypes: HostingTypeOption[] = [
  {
    type: 'rooms',
    label: '숙소',
    src: 'https://res.cloudinary.com/dfiaqyaug/image/upload/v1762927537/4aae4ed7-5939-4e76-b100-e69440ebeae4_y5c8hl.png',
    alt: '숙소 호스팅 아이콘',
  },
  {
    type: 'experience',
    label: '체험',
    src: 'https://res.cloudinary.com/dfiaqyaug/image/upload/v1762931477/e47ab655-027b-4679-b2e6-df1c99a5c33d_itixfd.png',
    alt: '체험 호스팅 아이콘',
  },
  {
    type: 'services',
    label: '서비스',
    src: 'https://res.cloudinary.com/dfiaqyaug/image/upload/v1762931596/3d67e9a9-520a-49ee-b439-7b3a75ea814d_c2wozh.png',
    alt: '서비스 호스팅 아이콘',
  },
];

interface HostingTypeButtonProps {
  option: HostingTypeOption;
  selectedType: HostingType | null;
  onSelect: (type: HostingType) => void;
}

function HostingTypeButton({
  option,
  selectedType,
  onSelect,
}: HostingTypeButtonProps) {
  const { type, label, src, alt } = option;
  return (
    <Button
      type="button"
      variant={selectedType === type ? 'default' : 'outline'}
      className="h-28 flex-col gap-2"
      onClick={() => onSelect(type)}
      disabled={type !== 'rooms'}
    >
      <div className="relative size-30">
        <Image src={src} alt={alt} fill style={{ objectFit: 'contain' }} />
      </div>
      <span>{label}</span>
    </Button>
  );
}

export default function HeaderHostingButton() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<HostingType | null>(null);

  const handleNext = () => {
    if (!selectedType) return;
    // 선택된 유형에 따라 호스팅 시작 페이지로 이동합니다.
    // 예: /hosting/rooms/start
    router.push(`/hosting`);
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant={'ghost'} size={'default'} className="rounded-full">
            호스팅 하기
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>원하시는 호스팅 유형을 선택하세요</DialogTitle>
            <DialogDescription>
              호스팅할 유형을 선택하고 다음 단계로 진행하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {hostingTypes.map((option) => (
              <HostingTypeButton
                key={option.type}
                option={option}
                selectedType={selectedType}
                onSelect={setSelectedType}
              />
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                취소
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleNext} disabled={!selectedType}>
              다음
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
