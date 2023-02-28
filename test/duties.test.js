import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import app from '../app.js';
import { dbName, dutiesDBCollection, createNewDuty } from '../database.js';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(dutiesDBCollection).deleteMany({});
});

const testDuty = {
  name: 'HilisDuty',
  location: 'nowhere',
  time: {
    start: 20230401,
    end: 20230402,
  },
  constraints: ['bla', 'bla'],
  soldiersRequired: 9033543,
  value: 8,
};

describe('Post duties route', () => {
  it('checks that status is 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/soldiers',
      body: testDuty,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual('soldier created');
  });
});

describe('Get all duties route', () => {
  it('checks that route returns an array', async () => {
    testDuty._id = 9033543;
    await createNewDuty(client, testDuty);
    const res = await app.inject({
      method: 'GET',
      url: '/soldiers?name=HilisDuty',
    });
    expect(res.body).toContain('[]');
  });
});

describe('Get duty by id route', () => {
  it('checks that when duty is found status is 200', async () => {
    testDuty._id = 9033543;
    await createNewDuty(client, testDuty);
    const res = await app.inject({
      method: 'GET',
      url: '/duties/9033543',
    });
    expect(res.statusCode).toBe(200);
  });
  it('checks that when duty is not found status is 400', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/duties/66666666',
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Delete duty by id route', () => {
  it('checks that when a duty is deleted status is 200', async () => {
    testDuty._id = 9033543;
    await createNewDuty(client, testDuty);
    const res = await app.inject({
      method: 'DELETE',
      url: '/duties/9033543',
    });
    expect(res.statusCode).toBe(200);
  });
  it('checks that when a duty doesnt exist status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(client, testDuty);
    const res = await app.inject({
      method: 'DELETE',
      url: '/duties/90335431',
    });
    expect(res.statusCode).toBe(400);
  });
});

const testParamsToChange = {
  location: 'here',
  name: 'nooooo',
};
describe('Patch duty route', () => {
  it('checks that when a duty is updated status is 200', async () => {
    testDuty._id = 9033543;
    await createNewDuty(client, testDuty);
    const res = await app.inject({
      method: 'PATCH',
      url: '/duties/9033543',
      body: testParamsToChange,
    });
    expect(res.statusCode).toBe(200);
  });
  it('checks that when a duty desnt exist status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(client, testDuty);
    const res = await app.inject({
      method: 'PATCH',
      url: '/duties/90335431',
      body: testParamsToChange,
    });
    expect(res.statusCode).toBe(400);
  });
});
