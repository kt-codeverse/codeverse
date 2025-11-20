import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ description: '예약 ID (리뷰는 예약에 연결됩니다.)' })
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  @ApiProperty({ description: '별점 (1-5)', example: 5 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  rating: number;

  @ApiProperty({ description: '리뷰 내용', required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
