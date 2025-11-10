import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    const { id, email, role } = user as {
      id: string;
      email: string;
      role?: string;
    };
    const token = this.authService.createAccessToken({ id, email, role });
    return { user, token };
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  me(
    @Req()
    req: Request & { user: { id: string; email: string; role?: string } },
  ) {
    return req.user;
  }
}
