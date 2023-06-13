import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import app from '../app.js';
import {
  dbName, soldiersDBCollection, addNewSoldier,
} from '../database/soldiers-repository.js';
import { dutiesDBCollection } from '../database/duties-repository.js';

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

async function createScheduledDutyForTest(soldier, newDuty) {
  const dutyToInsert = {
    name: newDuty.name,
    location: newDuty.location,
    time: newDuty.time,
    constraints: newDuty.constraints,
    soldiersRequired: newDuty.soldiersRequired,
    value: newDuty.value,
    soldiers: [soldier.id],
  };
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(dutyToInsert);
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
  soldiersRequired: 1,
  value: 8,
};

const testSoldier = {
  id: 3251084213556,
  name: 'Shira',
  rank: 0,
  limitations: ['none', 'none'],
};

describe('checks Get/Justice-board endpoint', () => {
  it('makes sure that route returns an array of objects', async () => {
    await addNewSoldier(testSoldier);
    createScheduledDutyForTest(testSoldier, testDuty);
    const res = await app.inject({
      method: 'GET',
      url: '/justice-board',
    });
    expect(res.body).toBe(`[{"_id":${testSoldier.id},"score":${testDuty.value}}]`);
  });
});
