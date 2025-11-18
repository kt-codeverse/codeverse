import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User as PrismaUser } from '@prisma/client';

export type JwtPayload = { sub: string; email: string; role?: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<PrismaUser, 'password'> | null> {
    const user = await this.users.findByEmail(email);
    if (!user) return null;

    const account = user as unknown as { password: string };
    const match = await this.users.validatePassword(account, pass);
    if (!match) return null;

    const u = user as unknown as PrismaUser;
    const { password: _password, ...rest } = u;
    void _password;
    return rest;
  }

  login(user: { id: string; email: string; role?: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }

  createAccessToken(user: { id: string; email: string; role?: string }) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  validateToken(token: string) {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
