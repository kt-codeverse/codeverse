import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 새로운 예약을 생성합니다.
   * @param roomId 예약을 생성할 숙소의 ID
   * @param guestId 예약을 생성하는 사용자의 ID
   * @param createBookingDto 예약 생성에 필요한 데이터
   */
  async create(
    roomId: string,
    guestId: string,
    createBookingDto: CreateBookingDto,
  ) {
    const { startDate, endDate } = createBookingDto;

    // 1. 숙소 존재 여부 및 호스트 본인 예약 방지
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('해당 숙소를 찾을 수 없습니다.');
    }
    if (room.hostId === guestId) {
      throw new ForbiddenException('자신의 숙소는 예약할 수 없습니다.');
    }

    // 2. 예약 가능 여부 확인 (날짜 겹치는지)
    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        roomId,
        OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
        status: { not: 'CANCELLED' }, // 취소된 예약은 제외
      },
    });
    if (existingBooking) {
      throw new ConflictException('해당 날짜에는 이미 예약이 있습니다.');
    }

    // 3. 총 가격 계산 (예시: 1박당 요금 * 숙박일수)
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalPrice = room.pricePerNight * nights;

    // 4. 예약 생성
    return this.prisma.booking.create({
      data: { startDate, endDate, totalPrice, roomId, guestId },
    });
  }

  /**
   * 특정 사용자의 모든 예약 내역을 조회합니다.
   * @param userId 사용자 ID
   */
  findAllByUserId(userId: string) {
    return this.prisma.booking.findMany({
      where: { guestId: userId },
      include: { room: true }, // 예약된 숙소 정보 포함
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * 특정 예약의 상세 정보를 조회합니다.
   * @param id 예약 ID
   */
  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: true, guest: true, payment: true, review: true },
    });
    if (!booking) {
      throw new NotFoundException('해당 예약을 찾을 수 없습니다.');
    }
    return booking;
  }

  /**
   * 예약을 취소합니다. (상태를 CANCELLED로 변경)
   * @param id 예약 ID
   */
  async cancel(id: string) {
    try {
      // update 메서드는 대상 레코드가 없을 경우 자동으로 에러를 발생시킵니다.
      // 따라서 findOne을 미리 호출할 필요 없이 바로 update를 시도할 수 있습니다.
      return await this.prisma.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
    } catch (error) {
      // Prisma의 RecordNotFound 에러를 확인하고 더 구체적인 예외를 던질 수 있습니다.
      // 여기서는 간단하게 NotFoundException을 다시 던집니다.
      throw new NotFoundException(
        '해당 예약을 찾을 수 없어 취소할 수 없습니다.',
      );
    }
  }
}
