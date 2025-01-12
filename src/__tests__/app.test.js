import request from 'supertest';
import app from '../app.js';

describe('Express App', () => {
  test('GET /health returns status ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('GET / returns welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  test('GET /api/data returns data', async () => {
    const response = await request(app).get('/api/data');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  test('GET /api/error returns 500', async () => {
    const response = await request(app).get('/api/error');
    expect(response.statusCode).toBe(500);
  });

  test('GET /metrics returns prometheus metrics', async () => {
    const response = await request(app).get('/metrics');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/^text\/plain/);
  });
});