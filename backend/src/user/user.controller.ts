import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { RegisterResponseDto } from './dto/register-response.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({
    status: 201,
    description: '유저 생성 및 토큰 반환',
    type: RegisterResponseDto,
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: CreateUserDto) {
    if (dto.password !== dto.passwordConfirm) {
      throw new BadRequestException('비밀번호와 확인이 일치하지 않습니다.');
    }

    const createUserDto: Omit<CreateUserDto, 'passwordConfirm'> = {
      email: dto.email,
      password: dto.password,
      name: dto.name,
      phoneNumber: dto.phoneNumber,
      avatar: dto.avatar,
    };

    const user = await this.userService.create(createUserDto as CreateUserDto);
    const { id, email, role } = user as {
      id: string;
      email: string;
      role?: string;
    };
    const token = this.authService.createAccessToken({ id, email, role });
    return { user, access_token: token };
  }

  @Get('me')
  @ApiOperation({ summary: '내 정보' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  me(
    @Req()
    req: Request & { user: { id: string; email: string; role?: string } },
  ) {
    return req.user;
  }
}
