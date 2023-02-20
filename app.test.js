import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from './connections.js';
import app from './app.js';
import { dbName, dbCollection, addNewSoldier } from './database.js';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(dbCollection).deleteMany({});
});

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

const testSoldier = {
  _id: 3251084213556,
  name: 'Shira',
  rank: 3,
  limitations: ['none', 'none'],
};

describe('Post soldier route', () => {
  it('checks that status is 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/soldiers',
      body: testSoldier,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual('soldier created');
  });
});

describe('Get soldier by id route', () => {
  it('checks that when soldier is found status is 200', async () => {
    await addNewSoldier(client, testSoldier);
    const res = await app.inject({
      method: 'GET',
      url: '/soldiers/3251084213556',
    });
    expect(res.statusCode).toBe(200);
  });
  it('checks that when soldier is not found status is 400', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/soldiers/66666666',
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Get soldiers route', () => {
  it('checks that route returns a string', async () => {
    await addNewSoldier(client, testSoldier);
    const res = await app.inject({
      method: 'GET',
      url: '/soldiers?name=Shira',
    });
    expect(res.body).toBeTypeOf('string');
  });
});
