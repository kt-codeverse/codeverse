import { Test } from '@nestjs/testing';
import {
  INestApplication,
  ExecutionContext,
  ValidationPipe,
  CanActivate,
  Type,
} from '@nestjs/common';
import type { Application } from 'express';
import request from 'supertest';
import { ReviewsController } from '../src/reviews/reviews.controller';
import { ReviewsService } from '../src/reviews/reviews.service';
import { AuthGuard } from '@nestjs/passport';

describe('Reviews validation (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) await app.close();
  });

  it('returns 400 when rating is missing', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt') as unknown as Type<CanActivate>)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const req: { user?: { id: string; email: string } } = ctx
            .switchToHttp()
            .getRequest();
          req.user = { id: 'u1', email: 'a@b' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    await request(app.getHttpServer() as unknown as Application)
      .post('/api/rooms/r1/reviews')
      .send({ bookingId: 'b1' })
      .expect(400);
  });

  it('returns 400 when rating is 0 (below min)', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt') as unknown as Type<CanActivate>)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const req: { user?: { id: string; email: string } } = ctx
            .switchToHttp()
            .getRequest();
          req.user = { id: 'u1', email: 'a@b' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    await request(app.getHttpServer() as unknown as Application)
      .post('/api/rooms/r1/reviews')
      .send({ bookingId: 'b1', rating: 0 })
      .expect(400);
  });

  it('accepts rating as string (coerced) and returns 201', async () => {
    const mockReview = {
      id: 'r1',
      rating: 5,
      comment: 'ok',
      createdAt: new Date().toISOString(),
      bookingId: 'b1',
      roomId: 'r1',
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: { create: jest.fn().mockResolvedValue(mockReview) },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt') as unknown as Type<CanActivate>)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const req: { user?: { id: string; email: string } } = ctx
            .switchToHttp()
            .getRequest();
          req.user = { id: 'u1', email: 'a@b' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    const res = await request(app.getHttpServer() as unknown as Application)
      .post('/api/rooms/r1/reviews')
      .send({ bookingId: 'b1', rating: '5', comment: 'great' })
      .expect(201);

    expect(res.body).toHaveProperty('id', 'r1');
  });

  it('returns 400 when rating is non-numeric string', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt') as unknown as Type<CanActivate>)
      .useValue({
        canActivate: (ctx: ExecutionContext) => {
          const req: { user?: { id: string; email: string } } = ctx
            .switchToHttp()
            .getRequest();
          req.user = { id: 'u1', email: 'a@b' };
          return true;
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    await request(app.getHttpServer() as unknown as Application)
      .post('/api/rooms/r1/reviews')
      .send({ bookingId: 'b1', rating: 'foo' })
      .expect(400);
  });
});
