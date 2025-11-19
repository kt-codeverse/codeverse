export interface RoomImage {
  id: string;
  url: string;
  createdAt: string;
  roomId: string;
}

export interface Amenity {
  id: string;
  name: string;
  createdAt: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  rules: string | null;
  lat: number;
  lng: number;
  pricePerNight: number;
  createdAt: string;
  updatedAt: string;
  hostId: string;
  images: RoomImage[];
  amenities: Amenity[];
}
