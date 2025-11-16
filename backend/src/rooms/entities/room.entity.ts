import { ApiProperty } from '@nestjs/swagger';
import { Room, Image, Amenity, User } from '@prisma/client';

class ImageEntity implements Image {
  @ApiProperty({ description: '이미지 ID' })
  id: string;

  @ApiProperty({ description: '이미지 URL' })
  url: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiProperty({ description: '숙소 ID' })
  roomId: string;
}

class AmenityEntity implements Amenity {
  @ApiProperty({ description: '편의시설 ID' })
  id: string;

  @ApiProperty({ description: '편의시설 이름' })
  name: string;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;
}

class HostEntity {
  @ApiProperty({ description: '호스트 ID' })
  id: string;

  @ApiProperty({ description: '호스트 이름' })
  name: string;

  @ApiProperty({ description: '호스트 이메일' })
  email: string;

  @ApiProperty({ description: '호스트 프로필 사진 URL', nullable: true })
  avatar: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
  }
}

export class RoomEntity implements Room {
  @ApiProperty({ description: '숙소 ID' })
  id: string;

  @ApiProperty({ description: '숙소 제목' })
  title: string;

  @ApiProperty({ description: '숙소 설명' })
  description: string;

  @ApiProperty({ description: '국가' })
  country: string;

  @ApiProperty({ description: '도시' })
  city: string;

  @ApiProperty({ description: '숙소 규칙', required: false, nullable: true })
  rules: string | null;

  @ApiProperty({ description: '위도' })
  lat: number;

  @ApiProperty({ description: '경도' })
  lng: number;

  @ApiProperty({ description: '1박당 가격' })
  pricePerNight: number;

  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  @ApiProperty({ description: '수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '호스트 ID' })
  hostId: string;

  @ApiProperty({ type: () => HostEntity, description: '호스트 정보' })
  host?: HostEntity;

  @ApiProperty({ type: [ImageEntity], description: '숙소 이미지 목록' })
  images?: ImageEntity[];

  @ApiProperty({ type: [AmenityEntity], description: '편의시설 목록' })
  amenities?: AmenityEntity[];

  constructor(partial: Partial<RoomEntity>) {
    Object.assign(this, partial);
    if (partial.host) {
      this.host = new HostEntity(partial.host as any);
    }
  }
}
