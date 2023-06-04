import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it, vi,
} from 'vitest';
import { client } from '../connections.js';
import app from '../app.js';
import * as database from '../database/soldiers_repository.js';

const { dbName, soldiersDBCollection, addNewSoldier } = database;

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(soldiersDBCollection).deleteMany({});
});

const testSoldier = {
  id: '3251084213556',
  name: 'Shira',
  rank: '3',
  limitations: ['none', 'none'],
};

const testSoldier2 = {
  id: '3251084213556',
  name: 'blaaa',
  rank: '3',
  limitations: ['none', 'none'],
};

describe('Post soldier route', () => {
  it('should return status code 201 with the created soldier', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/soldiers',
      body: testSoldier,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toContain('id');
    expect(res.body).toContain(testSoldier.id);
    expect(res.body).toContain(testSoldier.name);
  });

  it('checks that when soldier not created because of duplicate id status is 400', async () => {
    await addNewSoldier(testSoldier);
    const res = await app.inject({
      method: 'POST',
      url: '/soldiers',
      body: testSoldier2,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'soldier not created - this id already exists!' });
  });

  it('checks for status 500 when theres a server error', async () => {
    const addNewSoldierSpy = vi.spyOn(database, 'addNewSoldier');
    addNewSoldierSpy.mockImplementation(() => {
      const err = new Error();
      throw err;
    });
    const res = await app.inject({
      method: 'POST',
      url: '/soldiers',
      body: testSoldier,
    });
    expect(res.json()).toEqual({ message: 'server error' });
  });
});

describe('Get soldier by id route', () => {
  it('checks that when soldier is found status is 200, and that found soldier is sent', async () => {
    await addNewSoldier(testSoldier);
    const res = await app.inject({
      method: 'GET',
      url: `/soldiers/${testSoldier.id}`,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toContain(testSoldier.name);
    expect(res.body).toContain(testSoldier.id);
  });

  it('checks that when soldier is not found status is 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/soldiers/6${testSoldier.id}`,
    });
    expect(res.statusCode).toBe(404);
  });

  it('checks for status 500 when theres a server error', async () => {
    const lookForSoldierSpy = vi.spyOn(database, 'lookForSoldier');
    lookForSoldierSpy.mockImplementation(() => {
      const err = new Error();
      throw err;
    });
    const res = await app.inject({
      method: 'GET',
      url: '/soldiers/:id',
      body: testSoldier.id,
    });
    expect(res.json()).toEqual({ message: 'server error' });
  });
});

describe('Get soldiers route', () => {
  it('checks that route returns the relevant object', async () => {
    await addNewSoldier(testSoldier);
    const result = await app.inject({
      method: 'GET',
      url: `/soldiers?rank=${testSoldier.rank}`,
    });
    expect(result.body).toContain(testSoldier.name);
  });

  it('checks that when searched using id you still get the relevant object back', async () => {
    await addNewSoldier(testSoldier);
    const res = await app.inject({
      method: 'GET',
      url: `/soldiers?name=${testSoldier.name}&id=${testSoldier.id}`,
    });
    expect(res.body).toContain(testSoldier.name);
    expect(res.body).toContain(testSoldier.id);
  });
});
