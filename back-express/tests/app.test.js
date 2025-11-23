import request from 'supertest';
import app from '../app.js';

describe('app routes', () => {
  test('GET /health/ping responds ok', async () => {
    const res = await request(app).get('/health/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
