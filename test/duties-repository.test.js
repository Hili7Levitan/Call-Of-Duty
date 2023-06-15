import { ObjectId } from 'mongodb';
import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';

import {
  addNewDuty,
  lookForAllDuties, dutiesDBCollection, dbName, deleteDutyById, lookForDutyById, updateDuty,
} from '../database/duties-repository.js';

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
    start: '2023-04-01',
    end: '2023-04-02',
  },
  constraints: ['bla', 'bla'],
  soldiersRequired: 2,
  value: 8,
};

describe('addNewDuty function', () => {
  it('should insert new duty', async () => {
    const result = await addNewDuty(testDuty);
    expect(result.acknowledged).eq(true);
  });
});

describe('lookForAllDuties function', () => {
  it('should find all relevant duties', async () => {
    await addNewDuty(testDuty);
    await addNewDuty(testDuty);
    const result = await lookForAllDuties({ name: testDuty.name });
    expect(result.length).toEqual(2);
  });
});

describe('lookForDutyById function', () => {
  it('checks that when searching by id returns a single object', async () => {
    const dutyInserted = await addNewDuty(testDuty);
    const dutyInsertedId = dutyInserted.insertedId;
    const result = await lookForDutyById(dutyInsertedId);
    expect(result._id).toEqual(dutyInsertedId);
  });
});

describe('deleteDutyById function', () => {
  it('checks that when deleting a duty, deleted count is 1', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    const result = await deleteDutyById(dutyInsertedId);
    expect(result.deletedCount).toBe(1);
  });

  it('checks that after deleting a duty it is not in the db', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    await deleteDutyById(dutyInsertedId);
    const result = await lookForAllDuties({ _id: ObjectId(dutyInsertedId) });
    expect(result.length).toBe(0);
  });
});

describe('updateDuty function', () => {
  const updatesToDo = {
    name: 'NotHilisDuty',
  };

  it('checks that when a duty is edited field changes', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    const result = await updateDuty(dutyInsertedId, updatesToDo);
    const changeRes = await lookForAllDuties(dutyInsertedId);
    expect(result.modifiedCount).toBe(1);
    expect(changeRes[0].name).toEqual('NotHilisDuty');
  });
});
