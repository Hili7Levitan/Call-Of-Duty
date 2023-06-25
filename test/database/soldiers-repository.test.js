import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../../connections.js';
import {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, dbName, soldiersDBCollection,
} from '../../database/soldiers-repository.js';

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
  id: '9033543',
  name: 'Amit',
  rank: '3',
  limitations: ['none', 'none'],
};

describe('addNewSoldier function', () => {
  it('Should insert soldier', async () => {
    const res = await addNewSoldier(testSoldier);
    expect(res._id).toEqual(testSoldier.id);
  });
});

describe('lookForSoldier function', () => {
  it('should find correct soldier', async () => {
    await addNewSoldier(testSoldier);
    const res = await lookForSoldier(testSoldier);
    expect(res._id).eq('9033543');
  });

  it('should find soldier when query doesnt have an id', async () => {
    await addNewSoldier(testSoldier);
    const res = await lookForSoldier({ name: testSoldier.name });
    expect(res._id).eq('9033543');
  });
});

describe('lookForAllSoldiers function', () => {
  it('should find all soldiers', async () => {
    await addNewSoldier(testSoldier);
    const res = await lookForAllSoldiers(testSoldier);
    expect(res.length).toBe(1);
  });
});
