import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', async () => {
    request(app.getHttpServer())
      .post('/auth/register')
      .send({
        firstName: 'David',
        lastName: 'Johnson',
        username: 'DaveJ',
        email: 'david@johnson.com',
        password: 'Code_1234',
      })
      .expect(200);
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'DaveJ',
        password: 'Code_1234',
      })
      .expect(200);

    accessToken = response.body.token;
  });

  it('/auth/profile (GET)', () =>
    request(app.getHttpServer())
      .get('/auth/profile')
      .set({ Authorization: `Bearer ${accessToken}` })
      .expect(200));

  afterAll(() => app.close());
});
