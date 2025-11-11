import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    const { lat, lng, hostId, images, amenities, ...rest } = createRoomDto;

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

  async findAll() {
    return this.prismaService.room.findMany({
      include: { images: true, amenities: true },
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

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id); // ID에 해당하는 숙소가 존재하는지 먼저 확인합니다. 없으면 findOne에서 예외를 던집니다.

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

  async remove(id: string) {
    await this.findOne(id); // ID에 해당하는 숙소가 존재하는지 먼저 확인합니다. 없으면 findOne에서 예외를 던집니다.
    return this.prismaService.room.delete({ where: { id } });
  }
}
