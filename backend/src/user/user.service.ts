import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { User as PrismaUser } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  private useMemory: boolean;
  private users: Map<string, UserEntity> | null = null;

  constructor(private readonly prismaService?: PrismaService) {
    this.useMemory = !prismaService || process.env.NODE_ENV === 'test';
    if (this.useMemory) {
      this.users = new Map<string, UserEntity>();
    }
  }

  async create(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    if (this.useMemory && this.users) {
      const existing = Array.from(this.users.values()).find(
        (u) => u.email === dto.email,
      );
      if (existing) throw new ConflictException('이미 등록된 이메일입니다.');

      const hashed = await bcrypt.hash(dto.password, 10);
      let id: string;
      if (process.env.NODE_ENV === 'test') {
        id = `test-${Math.random().toString(36).substring(2, 10)}`;
      } else {
        const { v4: uuidv4 } = await import('uuid');
        id = uuidv4();
      }

      const user = new UserEntity({
        id,
        email: dto.email,
        password: hashed,
        name: dto.name,
        avatar: dto.avatar,
        role: 'GUEST',
        verified: false,
      });

      this.users.set(user.id, user);
      const { password: _password, ...rest } = user;
      void _password;
      return rest;
    }

    // Prisma-backed
    const prisma = this.prismaService!;
    const existing = await prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('이미 등록된 이메일입니다.');

    const hashed = await bcrypt.hash(dto.password, 10);

    const created = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        name: dto.name ?? '',
        avatar: dto.avatar ?? null,
      },
    });

    const { password: _password, ...rest } = created as unknown as UserEntity;
    void _password;
    return rest;
  }

  findByEmail(
    email: string,
  ): UserEntity | undefined | Promise<UserEntity | undefined> {
    if (this.useMemory && this.users) {
      return Array.from(this.users.values()).find((u) => u.email === email);
    }
    const prisma = this.prismaService!;
    return prisma.user.findUnique({ where: { email } }) as Promise<
      UserEntity | undefined
    >;
  }

  findById(id: string): UserEntity | Promise<UserEntity> {
    if (this.useMemory && this.users) {
      const user = this.users.get(id);
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
      return user;
    }
    const prisma = this.prismaService!;
    return (async () => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
      return user as unknown as UserEntity;
    })();
  }

  async validatePassword(
    user: { password: string } | UserEntity | PrismaUser,
    plain: string,
  ): Promise<boolean> {
    const pwd = (user as { password: string }).password;
    return await bcrypt.compare(plain, pwd);
  }
}
