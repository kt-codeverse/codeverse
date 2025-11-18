'use client';
import { useState, ComponentType } from 'react';
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
import { Building, Star, BellRing, LucideProps } from 'lucide-react';

type HostingType = 'accommodation' | 'experience' | 'service';

interface HostingTypeOption {
  type: HostingType;
  label: string;
  Icon: ComponentType<LucideProps>;
}

const hostingTypes: HostingTypeOption[] = [
  { type: 'accommodation', label: '숙소', Icon: Building },
  { type: 'experience', label: '체험', Icon: Star },
  { type: 'service', label: '서비스', Icon: BellRing },
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
  const { type, label, Icon } = option;
  return (
    <Button
      type="button"
      variant={selectedType === type ? 'default' : 'outline'}
      className="h-24 flex-col gap-2"
      onClick={() => onSelect(type)}
    >
      <Icon />
      <span>{label}</span>
    </Button>
  );
}

export default function HeaderHostingButton() {
  const [selectedType, setSelectedType] = useState<HostingType | null>(null);

  const handleNext = () => {
    if (!selectedType) return;
    // TODO: 다음 단계로 진행하는 로직 구현 (e.g., router.push(`/hosting/new?type=${selectedType}`))
    console.log('선택된 호스팅 유형:', selectedType);
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
