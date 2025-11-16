import { ApiProperty } from '@nestjs/swagger';
import { Booking, BookingStatus } from '@prisma/client';

export class BookingEntity implements Booking {
  @ApiProperty({ description: '예약 고유 ID' })
  id: string;

  @ApiProperty({ description: '예약 시작일' })
  startDate: Date;

  @ApiProperty({ description: '예약 종료일' })
  endDate: Date;

  @ApiProperty({ description: '총 결제 금액' })
  totalPrice: number;

  @ApiProperty({
    description: '예약 상태',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @ApiProperty({ description: '생성 시각' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시각' })
  updatedAt: Date;

  @ApiProperty({ description: '예약한 숙소 ID' })
  roomId: string;

  @ApiProperty({ description: '예약한 게스트 ID' })
  guestId: string;

  constructor(partial: Partial<BookingEntity>) {
    Object.assign(this, partial);
  }
}
