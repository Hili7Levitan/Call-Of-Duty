import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, dbName, dbCollection,
} from '../database.js';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(dbCollection).deleteMany({});
});

describe('addNewSoldier function', () => {
  it('Should return res with acknowledged true', async () => {
    const res = await addNewSoldier({ name: 'Amit' });
    expect(res.acknowledged).eq(true);
  });
});

const testSoldier1 = {
  id: '12345',
  name: 'Hili',
  rank: '1',
  limitations: ['none', 'none'],
};

const testSoldier2 = {
  id: '45678',
  name: 'Hili',
  rank: '1',
  limitations: ['none', 'none'],
};

describe('lookForSoldier function', () => {
  it('should find correct soldier', async () => {
    await addNewSoldier(testSoldier1);
    const res = await lookForSoldier(testSoldier1);
    expect(res._id).toEqual(testSoldier1.id);
  });
});

describe('lookForAllSoldiers function', () => {
  it('should find all soldiers with the same name', async () => {
    await addNewSoldier(testSoldier1);
    await addNewSoldier({ ...testSoldier2, name: testSoldier1.name });
    const res = await lookForAllSoldiers({ name: testSoldier1.name });
    expect(res.length).toBe(2);
  });
});
