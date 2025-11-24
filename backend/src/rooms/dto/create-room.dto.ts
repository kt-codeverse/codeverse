import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({
    description: '숙소 이름',
    example: '서울역 근처 아늑한 아파트',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '숙소 설명',
    example:
      '서울의 중심에서 도시의 활기를 느껴보세요. 교통이 편리하고 주변에 맛집이 많습니다.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: '숙소 유형',
    example: '아파트',
  })
  @IsString()
  @IsNotEmpty()
  structure: string;

  @ApiProperty({
    description: '공간 유형',
    example: '공간 전체',
  })
  @IsString()
  @IsNotEmpty()
  privacyType: string;

  @ApiProperty({ description: '국가', example: 'South Korea' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: '도시', example: 'Seoul' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: '상세 주소',
    example: '중구 세종대로 110',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: '최대 게스트 수',
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  maxGuests: number;

  @ApiProperty({ description: '1박당 가격', example: 120 })
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ApiProperty({
    description: '편의시설 목록',
    example: ['WiFi', 'Kitchen', 'Air conditioning'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({
    description: '숙소 이미지 URL 목록',
    example: ['https://source.unsplash.com/random/800x600?apartment,seoul'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true }) // IsUrl은 seed 데이터의 형식과 맞지 않아 IsString으로 변경
  @IsOptional()
  images?: string[];

  @ApiProperty({ description: '위도', example: 37.5547, required: false })
  @IsLatitude()
  @IsOptional()
  lat?: number;

  @ApiProperty({ description: '경도', example: 126.9707, required: false })
  @IsLongitude()
  @IsOptional()
  lng?: number;
}
