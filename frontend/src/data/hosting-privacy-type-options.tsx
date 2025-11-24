import { Bed, DoorClosed, Users } from 'lucide-react';
import type { ComponentProps } from 'react';
import type RadioCardGroup from '@/components/hosting/RadioCardGroup';

type Option = ComponentProps<typeof RadioCardGroup>['options'][number];

export const hostingPrivacyTypeOptions: Option[] = [
  {
    value: '공간 전체',
    label: '공간 전체',
    desc: '게스트가 숙소 전체를 단독으로 사용합니다.',
    icon: <DoorClosed />,
  },
  {
    value: '방',
    label: '방',
    desc: '단독으로 사용하는 개인실이 있고, 공용 공간도 있는 형태입니다.',
    icon: <Bed />,
  },
  {
    value: '다인실',
    label: '다인실',
    desc: '다른 사람과 함께 사용하는 방입니다.',
    icon: <Users />,
  },
];
