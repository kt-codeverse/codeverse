import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  it('should create a user and hash the password', async () => {
    const dto: CreateUserDto = {
      email: 'youminki@example.com',
      password: 'password123',
      name: 'youminki',
    };

    const created = await service.create(dto);

    expect(created).toHaveProperty('id');
    expect(created).toHaveProperty('email', dto.email);
    const createdRec = created as Record<string, unknown>;
    expect(createdRec.password).toBeUndefined();

    const stored = (await service.findByEmail(
      dto.email,
    )) as unknown as UserEntity;
    expect(stored).toBeDefined();
    expect(stored.password).not.toEqual(dto.password);

    const valid = await service.validatePassword(stored, dto.password);
    expect(valid).toBe(true);
  });

  it('should not allow duplicate emails', async () => {
    const dto: CreateUserDto = {
      email: 'youminki@example.com',
      password: 'password123',
    };

    await service.create(dto);

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it('findById should return user or throw', async () => {
    const dto: CreateUserDto = {
      email: 'youminki@example.com',
      password: 'password123',
    };
    await service.create(dto);
    const stored = (await service.findByEmail(
      dto.email,
    )) as unknown as UserEntity;
    expect(stored).toBeDefined();
    const byId = await service.findById(stored.id);
    expect(byId.email).toEqual(dto.email);

    expect(() => service.findById('non-existent-id')).toThrow(
      NotFoundException,
    );
  });
});
