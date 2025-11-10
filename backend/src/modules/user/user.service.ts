import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private users: Map<string, UserEntity> = new Map();

  async create(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
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
      role: 'user',
      verified: false,
    });

    this.users.set(user.id, user);

    const { password: _password, ...rest } = user;
    void _password;
    return rest;
  }

  findByEmail(email: string): UserEntity | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  findById(id: string): UserEntity {
    const user = this.users.get(id);
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return user;
  }

  async validatePassword(user: UserEntity, plain: string): Promise<boolean> {
    return await bcrypt.compare(plain, user.password);
  }
}
