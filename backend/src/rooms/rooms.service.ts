import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Prisma } from '@prisma/client';
import { SearchRoomsDto } from './dto/search-rooms.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomDto: CreateRoomDto, hostId: string) {
    const { lat, lng, images, amenities, ...rest } = createRoomDto;

    // 1. hostId로 사용자를 찾습니다.
    const host = await this.prismaService.user.findUnique({
      where: { id: hostId },
    });

    // 2. 사용자가 존재하지 않으면 에러를 발생시킵니다.
    if (!host) {
      throw new NotFoundException(
        `ID가 '${hostId}'인 호스트를 찾을 수 없습니다.`,
      );
    }

    // 3. 사용자의 역할(role)이 HOST가 아니면 에러를 발생시킵니다.
    if (host.role !== Role.HOST) {
      throw new ForbiddenException(
        'HOST 역할의 사용자만 숙소를 생성할 수 있습니다.',
      );
    }

    // 클라이언트에서 위도(lat) 또는 경도(lng) 값이 제공되지 않을 경우,
    // 데이터베이스 제약 조건(Not Null)을 만족시키고
    // 지도 표시에 문제가 없도록 기본값 0으로 설정합니다.
    return this.prismaService.room.create({
      data: {
        ...rest,
        hostId,
        lat: lat ?? 0,
        lng: lng ?? 0,
        images: { create: (images ?? []).map((url) => ({ url })) },
        amenities: { connect: (amenities ?? []).map((name) => ({ name })) },
      },
    });
  }

  /**
   * 조건에 맞는 숙소를 검색하거나 전체 숙소 목록을 조회합니다.
   * @param query - 검색 필터 (destination, dates, guests)
   * @returns 검색 조건에 맞는 숙소 목록
   */
  async findAll(query: SearchRoomsDto) {
    const { destination, startDate, endDate, guests } = query;
    console.log({ query });

    const where: Prisma.RoomWhereInput = {};

    // 1. 목적지(destination) 필터링
    if (destination) {
      where.OR = [
        { country: { contains: destination } },
        { city: { contains: destination } },
        { address: { contains: destination } },
        { title: { contains: destination } },
      ];
    }

    // 2. 게스트 수(guests) 필터링
    if (guests) {
      where.maxGuests = {
        gte: guests,
      };
    }

    // 3. 날짜(startDate, endDate) 필터링
    // 해당 기간에 예약이 없는 방을 찾습니다.
    if (startDate && endDate) {
      where.bookings = {
        none: {
          // 요청된 기간과 겹치는 예약이 하나도 없어야 함
          OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }],
          // 취소된 예약은 겹치는 예약으로 간주하지 않음
          status: { not: 'CANCELLED' },
        },
      };
    }

    return this.prismaService.room.findMany({
      where,
      include: {
        images: true,
        amenities: true,
        host: { select: { name: true, avatar: true } },
      },
    });
  }

  async findOne(id: string) {
    const room = await this.prismaService.room.findUnique({
      where: { id },
      include: {
        images: true,
        amenities: true,
        host: true, // 호스트 정보도 함께 가져오면 유용할 수 있습니다.
      },
    });
    if (!room) {
      throw new NotFoundException(`ID가 '${id}'인 숙소를 찾을 수 없습니다.`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId?: string) {
    // 숙소 존재 확인
    const room = await this.findOne(id);

    // 권한 검사: 요청한 사용자가 호스트이거나 ADMIN이어야 함
    if (userId) {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `사용자 ID '${userId}'를 찾을 수 없습니다.`,
        );
      }
      if (user.role !== Role.ADMIN && room.hostId !== userId) {
        throw new ForbiddenException('숙소 수정 권한이 없습니다.');
      }
    }

    const { images, amenities, ...rest } = updateRoomDto;
    const updateData: Prisma.RoomUpdateInput = { ...rest };

    if (images) {
      updateData.images = {
        deleteMany: {}, // 기존 이미지 모두 삭제
        create: images.map((url) => ({ url })), // 새 이미지 생성
      };
    }

    if (amenities) {
      updateData.amenities = {
        set: [], // 기존 편의시설 연결 모두 해제
        connect: amenities.map((name) => ({ name })), // 새 편의시설 연결
      };
    }

    return this.prismaService.room.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, userId?: string) {
    const room = await this.findOne(id); // 숙소 존재 확인

    // 권한 검사: 요청한 사용자가 호스트이거나 ADMIN이어야 함
    if (userId) {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException(
          `사용자 ID '${userId}'를 찾을 수 없습니다.`,
        );
      }
      if (user.role !== Role.ADMIN && room.hostId !== userId) {
        throw new ForbiddenException('숙소 삭제 권한이 없습니다.');
      }
    }

    return this.prismaService.room.delete({ where: { id } });
  }
}
