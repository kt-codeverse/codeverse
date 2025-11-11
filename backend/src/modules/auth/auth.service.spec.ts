import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import type { IdGenerator } from '../../common/interfaces/id-generator.interface';

describe('AuthService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let authService: AuthService;
  let mockIdGenerator: IdGenerator;

  beforeEach(() => {
    mockIdGenerator = {
      generate: jest.fn().mockReturnValue('test-mock-id'),
    };
    userService = new UserService(mockIdGenerator);
    jwtService = new JwtService({
      secret: 'test-secret',
      signOptions: { expiresIn: '1h' },
    });
    authService = new AuthService(userService, jwtService);
  });

  it('validateUser should return user without password when credentials are correct', async () => {
    const dto: CreateUserDto = {
      email: 'auth@example.com',
      password: 'mypassword',
    };
    await userService.create(dto);

    const validated = await authService.validateUser(dto.email, dto.password);
    expect(validated).toBeDefined();
    const validatedRec = validated as Record<string, unknown>;
    expect(validatedRec.password).toBeUndefined();
    expect(validatedRec.email).toEqual(dto.email);
  });

  it('validateUser should return null for bad credentials', async () => {
    const res = await authService.validateUser('noone@example.com', 'x');
    expect(res).toBeNull();
  });

  it('login should return a valid jwt token and validateToken should decode it', async () => {
    const dto: CreateUserDto = {
      email: 'token@example.com',
      password: 'tokentest',
    };
    await userService.create(dto);
    const stored = userService.findByEmail(dto.email);
    expect(stored).toBeDefined();

    const tokenRes = authService.login({ id: stored!.id, email: dto.email });
    expect(tokenRes).toHaveProperty('access_token');
    const payload = authService.validateToken(tokenRes.access_token);
    expect(payload).toHaveProperty('sub');
    const payloadRec = payload as Record<string, unknown>;
    expect(payloadRec.email).toEqual(dto.email);
  });

  it('validateToken should throw for invalid token', () => {
    expect(() => authService.validateToken('bad.token')).toThrow(
      UnauthorizedException,
    );
  });
});
