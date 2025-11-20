import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Response } from 'supertest';
import type { Application } from 'express';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Reviews integration (e2e)', () => {
  let app: INestApplication;

  let _origNodeEnv: string | undefined;

  beforeAll(async () => {
    _origNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 30000);

  afterAll(async () => {
    if (app) await app.close();
    if (_origNodeEnv !== undefined) process.env.NODE_ENV = _origNodeEnv;
  });

  it('full flow: register host+guest, create room, booking, create review', async () => {
    const ts = Date.now();
    const host = {
      email: `host${ts}@example.com`,
      password: 'password',
      passwordConfirm: 'password',
      name: 'Host User',
      phoneNumber: '+821012341234',
    };

    const guest = {
      email: `guest${ts}@example.com`,
      password: 'password',
      passwordConfirm: 'password',
      name: 'Guest User',
      phoneNumber: '+821098765432',
    };

    const r1: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .post('/users/register')
      .send(host);

    if (r1.status !== 201) {
      console.error('register host failed', r1.status, r1.body);
      throw new Error('host register failed');
    }

    type RegisterResponse = { access_token?: string; user?: { id?: string } };
    const hostToken = (r1.body as RegisterResponse).access_token;
    expect(hostToken).toBeDefined();
    const hostId = (r1.body as RegisterResponse).user?.id;
    expect(hostId).toBeDefined();

    const prisma = app.get(PrismaService);
    await prisma.user.update({ where: { id: hostId }, data: { role: 'HOST' } });
    const loginRes: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .post('/auth/login')
      .send({ email: host.email, password: host.password })
      .expect(200);
    const hostTokenWithRole = (loginRes.body as { access_token?: string })
      .access_token;
    expect(hostTokenWithRole).toBeDefined();

    const r2: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .post('/users/register')
      .send(guest)
      .expect(201);

    const guestToken = (r2.body as { access_token?: string }).access_token;
    expect(guestToken).toBeDefined();

    const roomDto = {
      title: 'Test Room',
      description: 'Nice',
      country: 'South Korea',
      city: 'Seoul',
      pricePerNight: 10,
    };

    const r3: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .post('/rooms')
      .set('Authorization', `Bearer ${hostTokenWithRole}`)
      .send(roomDto);

    if (r3.status !== 201) {
      console.error('create room failed', r3.status, r3.body);
      throw new Error('create room failed');
    }

    const roomId = (r3.body as { id?: string }).id;
    expect(roomId).toBeDefined();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2);

    const bookingDto = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    const r4: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .post(`/rooms/${roomId}/bookings`)
      .set('Authorization', `Bearer ${guestToken}`)
      .send(bookingDto);

    const me: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .get('/users/me')
      .set('Authorization', `Bearer ${guestToken}`);

    console.log('GET /users/me status', me.status, 'body', me.body);

    if (r4.status !== 201) {
      console.error('create booking failed', r4.status, r4.body);
      throw new Error('create booking failed');
    }

    const bookingId = (r4.body as { id?: string }).id;
    expect(bookingId).toBeDefined();

    // create review as guest
    const reviewDto = { bookingId, rating: 5, comment: 'Great!' };

    const r5: Response = await request(
      app.getHttpServer() as unknown as Application,
    )
      .post(`/rooms/${roomId}/reviews`)
      .set('Authorization', `Bearer ${guestToken}`)
      .send(reviewDto)
      .expect(201);

    expect(r5.body).toHaveProperty('id');
  }, 60000);
});
