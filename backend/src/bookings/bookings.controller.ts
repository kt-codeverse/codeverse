import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingEntity } from './entities/booking.entity';

interface AuthenticatedRequest extends Request {
  user: { id: string; email: string }; // JWT Payload에 따른 타입 정의
}

@ApiTags('예약서비스(bookings)')
@ApiBearerAuth()
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @ApiOperation({ summary: '숙소 예약 생성' })
  @Post('rooms/:roomId/bookings')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Param('roomId') roomId: string,
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<BookingEntity> {
    // const guestId = 'fd252871-e0d7-4874-b557-82124647f2b5';
    const guestId = req.user.id;
    const booking = await this.bookingsService.create(
      roomId,
      guestId,
      createBookingDto,
    );
    return new BookingEntity(booking);
  }

  @ApiOperation({ summary: '내 예약 목록 조회' })
  @Get('bookings/my')
  async findMyBookings(
    @Request() req: AuthenticatedRequest,
  ): Promise<BookingEntity[]> {
    const bookings = await this.bookingsService.findAllByUserId(req.user.id);
    return bookings.map(
      (booking) => new BookingEntity(booking as Partial<BookingEntity>),
    );
  }

  @ApiOperation({ summary: '예약 상세 조회' })
  @Get('bookings/:id')
  async findOne(@Param('id') id: string): Promise<BookingEntity> {
    const booking = await this.bookingsService.findOne(id);
    return new BookingEntity(booking as Partial<BookingEntity>);
  }

  @ApiOperation({ summary: '예약 취소' })
  @Patch('bookings/:id/cancel')
  async cancel(@Param('id') id: string): Promise<BookingEntity> {
    const booking = await this.bookingsService.cancel(id);
    return new BookingEntity(booking);
  }
}
