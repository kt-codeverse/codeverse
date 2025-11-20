import { ApiProperty } from '@nestjs/swagger';
import { Review } from '@prisma/client';

export class ReviewEntity implements Review {
  @ApiProperty({ description: '리뷰 ID' })
  id: string;

  @ApiProperty({ description: '별점' })
  rating: number;

  @ApiProperty({ description: '리뷰 내용', required: false })
  comment: string | null;

  @ApiProperty({ description: '작성 시각' })
  createdAt: Date;

  @ApiProperty({ description: '예약 ID' })
  bookingId: string;

  @ApiProperty({ description: '숙소 ID' })
  roomId: string;

  constructor(partial: Partial<ReviewEntity>) {
    Object.assign(this, partial);
  }
}
