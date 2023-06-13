import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import {
  dbName, soldiersDBCollection, addNewSoldier, lookForSoldier,
} from '../database/soldiers-repository.js';
import { addNewDuty, dutiesDBCollection } from '../database/duties-repository.js';
import { getJusticeBoard, scheduleDuty } from '../database/justice-board-repository.js';

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

const testDuty = {
  name: 'HilisDuty',
  location: 'nowhere',
  time: {
    start: 20230401,
    end: 20230402,
  },
  constraints: ['bla', 'bla'],
  soldiersRequired: 2,
  value: 8,
};

const testSoldier1 = {
  id: 325108421,
  name: 'Lior',
  rank: 0,
  limitations: ['none', 'none'],
};

const testSoldier2 = {
  id: 325108413,
  name: 'Hili',
  rank: 0,
  limitations: ['none', 'bla'],
};
async function createScheduledDutyForTest(soldiersScheduled, newDuty) {
  const dutyToInsert = {
    name: newDuty.name,
    location: newDuty.location,
    time: newDuty.time,
    constraints: newDuty.constraints,
    soldiersRequired: newDuty.soldiersRequired,
    value: newDuty.value,
    soldiers: soldiersScheduled,
  };
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(dutyToInsert);
  return dutyInserted;
}

describe('getJusticeBoard function', () => {
  it('checks that function returns correct justice for all soldiers in db', async () => {
    await addNewSoldier(testSoldier1);
    await addNewSoldier(testSoldier2);
    const soldiers = [testSoldier1.id, testSoldier2.id];
    await createScheduledDutyForTest(soldiers, testDuty);
    const res = await getJusticeBoard();
    expect(res).toEqual([
      { _id: testSoldier1.id, score: testDuty.value },
      { _id: testSoldier2.id, score: testDuty.value },
    ]);
    expect(res.length).toBe(2);
  });
});

describe('scheduleDuty function', () => {
  it('checks that unscheduled duty gets scheduled', async () => {
    testDuty.soldiersRequired = 1;
    const dutyInsersion = await addNewDuty(testDuty);
    await addNewSoldier(testSoldier1);
    const res = await scheduleDuty(dutyInsersion.insertedId);
    expect(res.soldiers).toEqual([{ _id: testSoldier1.id, score: 0 }]);
  });

  it('checks that a scheduled duty doesnt get scheduled', async () => {
    const dutyInsersion = await addNewDuty(testDuty);
    await addNewSoldier(testSoldier1);
    await scheduleDuty(dutyInsersion.insertedId);
    const res = await scheduleDuty(dutyInsersion.insertedId);
    expect(res).toEqual({ message: 'oops! duty is already scheduled' });
  });

  it('checks that a soldier that has a limitation and cant perform duty doesnt get scheduled', async () => {
    const dutyInsersion = await addNewDuty(testDuty);
    await addNewSoldier(testSoldier1);
    const res = await scheduleDuty(dutyInsersion.insertedId);
    expect(res.soldiers).toEqual([{ _id: testSoldier1.id, score: 0 }]);
    expect(res.soldiers.length).toBe(1);
  });

  it('checked that when scheduling a duty it gets the right amount of soldiers', async () => {
    testDuty.soldiersRequired = 2;
    const dutyInsersion = await addNewDuty(testDuty);
    await addNewSoldier(testSoldier1);
    testSoldier2.limitations = ['none', 'none'];
    await addNewSoldier(testSoldier2);
    const res = await scheduleDuty(dutyInsersion.insertedId);
    expect(res.soldiers.length).toBe(2);
  });

  it('checks that when a soldier gets a duty it updated its rank and duties', async () => {
    const dutyInsersion = await addNewDuty(testDuty);
    await addNewSoldier(testSoldier1);
    await scheduleDuty(dutyInsersion.insertedId);
    const res = await lookForSoldier({ name: testSoldier1.name });
    expect(res.rank).toBe(8);
  });
});
