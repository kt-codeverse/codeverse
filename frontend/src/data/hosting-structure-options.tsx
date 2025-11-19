import {
  Home,
  Building,
  Hotel,
  Building2,
  BedDouble,
  Warehouse,
  MountainSnow,
  Castle,
  Caravan,
  Sailboat,
  Tractor,
  Tent,
  TreePine,
  Landmark,
  ConciergeBell,
} from 'lucide-react';
import type { ComponentProps } from 'react';
import type RadioCardGroup from '@/components/hosting/RadioCardGroup';

type Option = ComponentProps<typeof RadioCardGroup>['options'][number];

export const hostingStructureOptions: Option[] = [
  {
    value: 'house',
    label: '주택',
    desc: '단독주택, 펜션 등',
    icon: <Home />,
  },
  {
    value: 'apartment',
    label: '아파트',
    desc: '아파트, 공동주택 등',
    icon: <Building />,
  },
  {
    value: 'guesthouse',
    label: '게스트용 별채',
    desc: '게스트 스위트 등',
    icon: <Building2 />,
  },
  {
    value: 'hotel',
    label: '호텔',
    desc: '부티크 호텔, 호스텔 등',
    icon: <Hotel />,
  },
  {
    value: 'b&b',
    label: 'B&B',
    desc: '아침 식사를 제공하는 숙소',
    icon: <BedDouble />,
  },
  {
    value: 'loft',
    label: '로프트',
    desc: '개방형 구조의 공간',
    icon: <Warehouse />,
  },
  {
    value: 'cabin',
    label: '통나무집',
    desc: '자연 속에 위치한 숙소',
    icon: <MountainSnow />,
  },
  {
    value: 'castle',
    label: '성',
    desc: '역사적인 건축물',
    icon: <Castle />,
  },
  {
    value: 'camper',
    label: '캠핑카/RV',
    desc: '이동 가능한 숙소',
    icon: <Caravan />,
  },
  {
    value: 'tiny-house',
    label: '타이니 하우스',
    desc: '작고 아담한 집',
    icon: <Home className="size-5" />,
  },
  {
    value: 'boat',
    label: '보트',
    desc: '하우스보트, 요트 등',
    icon: <Sailboat />,
  },
  { value: 'farm', label: '농장', desc: '농장 체험 숙소', icon: <Tractor /> },
  { value: 'yurt', label: '유르트', desc: '전통 몽골 텐트', icon: <Tent /> },
  {
    value: 'treehouse',
    label: '트리하우스',
    desc: '나무 위에 지은 집',
    icon: <TreePine />,
  },
  {
    value: 'ryokan',
    label: '료칸',
    desc: '일본 전통 숙소',
    icon: <Landmark />,
  },
  {
    value: 'condo',
    label: '콘도',
    desc: '리조트 내 아파트',
    icon: <Building />,
  },
  {
    value: 'serviced-apartment',
    label: '서비스드 아파트먼트',
    icon: <ConciergeBell />,
  },
  {
    value: 'bungalow',
    label: '방갈로',
    desc: '단층의 작은 집',
    icon: <Home />,
  },
];
