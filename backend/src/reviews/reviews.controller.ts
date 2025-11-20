import {
  Controller,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import type { Request as ExpressRequest } from 'express';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReviewEntity } from './entities/review.entity';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; email: string };
}

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: '숙소 리뷰 생성' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('rooms/:roomId/reviews')
  async create(
    @Param('roomId') roomId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ReviewEntity> {
    const userId = req.user.id;
    const review = await this.reviewsService.create(roomId, userId, dto);
    return new ReviewEntity(review as Partial<ReviewEntity>);
  }

  @ApiOperation({ summary: '숙소 리뷰 목록 조회' })
  @Get('rooms/:roomId/reviews')
  async findByRoom(@Param('roomId') roomId: string) {
    const reviews = await this.reviewsService.findAllByRoom(roomId);

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      bookingId: r.bookingId,
      roomId: r.roomId,
      guest: r.booking?.guest
        ? {
            id: r.booking.guest.id,
            name: r.booking.guest.name,
            email: r.booking.guest.email,
            avatar: r.booking.guest.avatar,
          }
        : null,
    }));
  }

  @ApiOperation({ summary: '리뷰 수정' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('reviews/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.reviewsService.update(id, req.user.id, dto);
  }

  @ApiOperation({ summary: '리뷰 삭제' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('reviews/:id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.reviewsService.remove(id, req.user.id);
  }
}
