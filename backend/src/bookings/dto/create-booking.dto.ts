import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: '예약 시작일',
    example: '2024-08-15T15:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    description: '예약 종료일',
    example: '2024-08-17T11:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
