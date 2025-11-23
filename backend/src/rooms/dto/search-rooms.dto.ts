import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SearchRoomsDto {
  @ApiProperty({
    description: '검색할 목적지 (국가, 도시, 주소 등)',
    required: false,
  })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({ description: '체크인 날짜', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ description: '체크아웃 날짜', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ description: '게스트 수', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests?: number;
}
