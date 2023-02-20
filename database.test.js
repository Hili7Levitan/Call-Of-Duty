import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from './connections.js';
import {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, dbName, dbCollection,
} from './database.js';

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
  it('Should insert soldier', async () => {
    const res = await addNewSoldier(client, { name: 'Amit' });
    expect(res.acknowledged).eq(true);
  });
});

describe('lookForSoldier function', () => {
  it('should find correct soldier', async () => {
    await addNewSoldier(client, { _id: 9033543 });
    const res = await lookForSoldier(client, { _id: 9033543 });
    expect(res._id).eq(9033543);
  });
});

describe('lookForAllSoldiers function', () => {
  it('should find all soldiers', async () => {
    await addNewSoldier(client, { _id: 9033543 });
    const res = await lookForAllSoldiers(client, { _id: 9033543 });
    expect(res.length).toBe(1);
  });
});
