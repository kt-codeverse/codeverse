export interface CreateRoomDto {
  // 구조
  structure: string;
  privacyType: string;
  // floorPlan,

  // 위치
  address?: string;
  lat?: number;
  lng?: number;

  // 편의시설
  amenities?: string[];

  // 이미지
  images?: string[];

  title: string;
  description: string;
  pricePerNight: number;

  maxGuests: number;
  country: string;
  city: string;
}
