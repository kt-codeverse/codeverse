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

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsString({ each: true }) // IsUrl은 seed 데이터의 형식과 맞지 않아 IsString으로 변경
  @IsOptional()
  images?: string[];

  @IsLatitude()
  @IsOptional()
  lat?: number;

  @IsLongitude()
  @IsOptional()
  lng?: number;

  // TODO: 인증 구현 후 request의 user 정보에서 가져와야 합니다.
  // 현재는 클라이언트에서 보내주는 값으로 처리합니다.
  @IsString()
  @IsNotEmpty()
  hostId: string;
}
