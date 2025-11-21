import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; email: string; role: string };
}

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  @ApiOperation({ summary: '숙소 생성' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post()
  create(
    @Request() req: AuthenticatedRequest,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    // 인증서비스가 완료되면 사용자아이디를 사용
    // const hostId = req.user.id;
    const hostId = req.user?.id;
    return this.roomsService.create(createRoomDto, hostId);
  }

  @ApiOperation({ summary: '숙소 전체 조회' })
  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @ApiOperation({ summary: '숙소 상세 조회' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '숙소 수정' })
  @Patch(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    // 권한은 서비스 레이어에서 검증합니다. 현재는 인증된 사용자 ID를 전달합니다.
    const userId = req.user?.id;
    return this.roomsService.update(id, updateRoomDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '숙소 삭제' })
  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    const userId = req.user?.id;
    return this.roomsService.remove(id, userId);
  }
}
