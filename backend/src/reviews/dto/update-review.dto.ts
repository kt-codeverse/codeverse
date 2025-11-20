import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @ApiPropertyOptional({ description: '별점 (1-5)', example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  rating?: number;

  @ApiPropertyOptional({ description: '리뷰 내용' })
  @IsOptional()
  @IsString()
  comment?: string;
}
