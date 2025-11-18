'use client';

import { useState, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
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

/**
 * 호스팅 유형을 선택하는 페이지입니다. (호스팅 절차 1단계)
 */
export default function SelectHostingTypePage() {
  const [selectedType, setSelectedType] = useState<HostingType | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (!selectedType) return;
    // TODO: 선택된 유형에 따라 다음 단계 페이지로 이동합니다.
    // 예: /hosting/accommodation/location
    router.push(`/hosting/title`); // 임시로 title 페이지로 이동
  };

  return (
    <div className="container mx-auto flex h-screen flex-col items-center justify-center sm:max-w-[425px]">
      <div className="w-full">
        <h1 className="text-2xl font-bold">
          원하시는 호스팅 유형을 선택하세요
        </h1>
        <p className="mt-2 text-gray-600">
          호스팅할 유형을 선택하고 다음 단계로 진행하세요.
        </p>
        <div className="grid grid-cols-3 gap-4 py-8">
          {hostingTypes.map((option) => (
            <HostingTypeButton
              key={option.type}
              option={option}
              selectedType={selectedType}
              onSelect={setSelectedType}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleNext} disabled={!selectedType}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
