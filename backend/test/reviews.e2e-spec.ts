import { Test } from '@nestjs/testing';
import {
  INestApplication,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Type,
} from '@nestjs/common';
import request from 'supertest';
import type { Application } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ReviewsController } from '../src/reviews/reviews.controller';
import { ReviewsService } from '../src/reviews/reviews.service';

describe('Reviews (e2e) auth guard', () => {
  let app: INestApplication;

  const mockReview = {
    id: 'r1',
    rating: 5,
    comment: 'Great! ',
    createdAt: new Date().toISOString(),
    bookingId: 'b1',
    roomId: 'room1',
  };

  afterEach(async () => {
    if (app) await app.close();
  });

  it('returns 401 when unauthenticated', async () => {
    const JwtAuthGuard = AuthGuard('jwt') as unknown as Type<CanActivate>;

    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: () => {
          throw new UnauthorizedException();
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    await request(app.getHttpServer() as unknown as Application)
      .post('/api/rooms/room1/reviews')
      .send({ bookingId: 'b1', rating: 5 })
      .expect(401);
  });

  it('allows access when authenticated', async () => {
    const JwtAuthGuard = AuthGuard('jwt') as unknown as Type<CanActivate>;

    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockReview),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const req: {
            user?: { id: string; email: string };
          } = ctx.switchToHttp().getRequest();
          req.user = { id: 'b1', email: 'test@example.com' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    const res = await request(app.getHttpServer() as unknown as Application)
      .post('/api/rooms/room1/reviews')
      .send({ bookingId: 'b1', rating: 5 })
      .expect(201);

    expect(res.body).toHaveProperty('id', 'r1');
  });
});
