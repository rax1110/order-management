import request from 'supertest';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { setupTestApp } from './support/test-utils';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let server: any;

  beforeAll(async () => {
    app = await setupTestApp();
    server = app.getHttpServer();
  }, 30000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  it('should return 404 for non-existent route', async () => {
    return request(server)
      .get('/non-existent')
      .expect(404);
  });
}); 