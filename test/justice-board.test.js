import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import app from '../app.js';
import {
  dbName, soldiersDBCollection, addNewSoldier, dutiesDBCollection,
} from '../database.js';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(soldiersDBCollection).deleteMany({});
});

beforeEach(async () => {
  await client.db(dbName).collection(dutiesDBCollection).deleteMany({});
});

async function createNewDutyForTest(soldier, newDuty) {
  newDuty.soldier = [soldier._id];
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(newDuty);
  return dutyInserted;
}

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

const testSoldier = {
  _id: 3251084213556,
  name: 'Shira',
  rank: 3,
  limitations: ['none', 'none'],
};

describe('checks Get/Justice-board endpoint', () => {
  it('makes sure that route returns an array of objects', async () => {
    addNewSoldier(client, testSoldier);
    createNewDutyForTest(testSoldier, testDuty);
    const res = await app.inject({
      method: 'GET',
      url: '/justice-board',
    });
    expect(res.body).toBe(`[{"_id":${testSoldier._id},"score":${testDuty.value}}]`);
  });
});
