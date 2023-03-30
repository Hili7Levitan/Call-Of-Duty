import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import app from '../app.js';
import { dbName, soldiersDBCollection } from '../database/soldiers-repository.js';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(soldiersDBCollection).deleteMany({});
});

describe('Get health route', () => {
  it('checks that status is 200 and it returns ok', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/health',
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ message: 'ok' });
  });

  it('checks for 404 status when route is wrong', async () => {
    const res = await app.inject({
      method: 'GET',
      url: 'helt',
    });
    expect(res.statusCode).toBe(404);
  });
});
