import {
  Wifi,
  Tv,
  UtensilsCrossed,
  Wind,
  Thermometer,
  Waves,
  ParkingCircle,
  Zap,
  Dumbbell,
  Siren,
  ShieldAlert,
  // FirstAid,
  Flame,
} from 'lucide-react';

export const amenityCategories = [
  {
    name: '주요 편의시설',
    items: [
      { id: 'wifi', label: '와이파이', icon: <Wifi /> },
      { id: 'tv', label: 'TV', icon: <Tv /> },
      { id: 'kitchen', label: '주방', icon: <UtensilsCrossed /> },
      { id: 'airConditioning', label: '에어컨', icon: <Wind /> },
      { id: 'heating', label: '난방', icon: <Thermometer /> },
    ],
  },
  {
    name: '특색 있는 편의시설',
    items: [
      { id: 'pool', label: '수영장', icon: <Waves /> },
      {
        id: 'freeParking',
        label: '건물 내 무료 주차',
        icon: <ParkingCircle />,
      },
      { id: 'evCharger', label: '전기차 충전 시설', icon: <Zap /> },
      { id: 'gym', label: '헬스장', icon: <Dumbbell /> },
    ],
  },
  {
    name: '안전 관련 편의시설',
    items: [
      { id: 'smokeAlarm', label: '화재경보기', icon: <Siren /> },
      {
        id: 'carbonMonoxideAlarm',
        label: '일산화탄소 경보기',
        icon: <ShieldAlert />,
      },
      { id: 'fireExtinguisher', label: '소화기', icon: <Flame /> },
      // { id: 'firstAidKit', label: '구급상자', icon: <FirstAid /> },
    ],
  },
];

export type Amenity = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export type AmenityCategory = {
  name: string;
  items: Amenity[];
};
