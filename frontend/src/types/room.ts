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

export interface Host {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
  verified: boolean;
  password: string;
  hashedRefreshToken: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  address: string;
  rules: string | null;
  lat: number;
  lng: number;
  pricePerNight: number;
  maxGuests: number;
  privacyType: string;
  structure: string;
  createdAt: string;
  updatedAt: string;
  hostId: string;
  host: Host;
  images: RoomImage[];
  amenities: Amenity[];
}
