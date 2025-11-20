import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(roomId: string, userId: string, dto: CreateReviewDto) {
    const { bookingId, rating, comment } = dto;

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('해당 숙소를 찾을 수 없습니다.');
    }

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('해당 예약을 찾을 수 없습니다.');
    }

    if (booking.guestId !== userId) {
      throw new ForbiddenException(
        '자신의 예약이 아닌 경우 리뷰를 작성할 수 없습니다.',
      );
    }

    if (booking.roomId !== roomId) {
      throw new BadRequestException(
        '예약된 숙소와 요청한 숙소가 일치하지 않습니다.',
      );
    }

    const existing = await this.prisma.review.findUnique({
      where: { bookingId },
    });
    if (existing) {
      throw new ConflictException('해당 예약에 이미 리뷰가 존재합니다.');
    }

    return this.prisma.review.create({
      data: { bookingId, rating, comment, roomId },
    });
  }

  findAllByRoom(roomId: string) {
    return this.prisma.review.findMany({
      where: { roomId },
      include: {
        booking: {
          include: {
            guest: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }
    if (review.booking.guestId !== userId) {
      throw new ForbiddenException('작성자만 수정할 수 있습니다.');
    }

    return this.prisma.review.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: { booking: true },
    });
    if (!review) {
      throw new NotFoundException('해당 리뷰를 찾을 수 없습니다.');
    }
    if (review.booking.guestId !== userId) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다.');
    }

    return this.prisma.review.delete({ where: { id } });
  }
}
