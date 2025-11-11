import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

// TODO: 인증 구현 후 AuthenticatedRequest 인터페이스로 교체해야 합니다.
interface TmpRequest extends ExpressRequest {
  user?: { id: string };
}

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: TmpRequest, @Body() createRoomDto: CreateRoomDto) {
    // TODO: 인증 구현 후에는 req.user가 항상 존재하므로 이 값은 삭제되어야 합니다.
    const hostId = req.user?.id ?? 'temp-host-id'; // 임시 값
    return this.roomsService.create(createRoomDto, hostId);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
