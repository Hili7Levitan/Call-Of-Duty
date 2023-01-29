import { describe, expect, it } from 'vitest';
import app from './app.js';

describe('Get health route', () => {
  it('checks that status is 200', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual('ok');
  });

  it('checks for 404 status when route is wrong', async () => {
    const res = await app.inject({
      method: 'GET',
      url: 'helt',
    });
    expect(res.statusCode).toBe(404);
  });
});
