import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { ObjectId } from 'mongodb';
import { client } from '../connections.js';
import app from '../app.js';
import {
  dutiesDBCollection, addNewDuty, updateDuty, lookForAllDuties,
} from '../database/duties-repository.js';
import { dbName, addNewSoldier, soldiersDBCollection } from '../database/soldiers-repository.js';

beforeAll(async () => {
  await client.connect();
});

afterAll(async () => {
  await client.close();
});

beforeEach(async () => {
  await client.db(dbName).collection(dutiesDBCollection).deleteMany({});
});
beforeEach(async () => {
  await client.db(dbName).collection(soldiersDBCollection).deleteMany({});
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

const testSoldier = {
  id: 3251084213556,
  name: 'Shira',
  rank: 0,
  limitations: ['none', 'none'],
};

describe('Post duties route', () => {
  it('checks that status is 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/duties',
      body: testDuty,
    });
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    expect(res.statusCode).toBe(201);
    expect(res.body).toContain(dutyInserted[0]._id);
  });
});

describe('Get all duties route', () => {
  it('checks that route returns all relevant duties', async () => {
    testDuty._id = 9033543;
    await addNewDuty(testDuty);
    await addNewDuty(testDuty);
    const res = await app.inject({
      method: 'GET',
      url: `/duties?name=${testDuty.name}`,
    });
    expect(res.json().length).toBe(2);
  });
});

describe('Get duty by id route', () => {
  it('checks that when duty is found status is 200', async () => {
    testDuty._id = 9033543;
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    const res = await app.inject({
      method: 'GET',
      url: `/duties/${dutyInsertedId}`,
    });
    expect(res.statusCode).toBe(200);
  });

  it('checks that when duty is not found status is 400', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/duties/${ObjectId(6666666)}`,
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('Delete duty by id route', () => {
  it('checks that when a duty is deleted status is 200', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    const res = await app.inject({
      method: 'DELETE',
      url: `/duties/${dutyInsertedId}`,
    });
    expect(res.statusCode).toBe(200);
  });
  it('checks that when a duty doesnt exist status is 400', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/duties/${ObjectId(6666666)}`,
    });
    expect(res.statusCode).toBe(400);
  });
  it('checks that when a duty is already scheduled status is 400', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    await updateDuty(dutyInsertedId, { soldiers: [9033544] });
    const res = await app.inject({
      method: 'DELETE',
      url: `/duties/${dutyInsertedId}`,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'scheduled duties cannot be deleted' });
  });
});

const testParamsToChange = {
  location: 'here',
  name: 'nooooo',
};
describe('Patch duty route', () => {
  it('checks that when a duty is updated status is 200', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/${dutyInsertedId}`,
      body: testParamsToChange,
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ message: 'duty updated' });
  });
  it('checks that when a duty is not updated status is 400', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/${dutyInsertedId}`,
      body: { name: testDuty.name },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'not updated' });
  });
  it('checks that when a duty is already scheduled status is 400', async () => {
    await addNewDuty(testDuty);
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    await updateDuty(dutyInsertedId, { soldiers: [9033544] });
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/${dutyInsertedId}`,
      body: { name: testDuty.name },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'scheduled duties cannot be changed!' });
  });
  it('checks that when a duty desnt exist status is 400', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/${ObjectId(666666)}`,
      body: testParamsToChange,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'duty doesnt exist!' });
  });
});

describe('Get duty endpoint', () => {
  it('checks that when a duties are searched by parameters the right objects are returned', async () => {
    await addNewDuty(testDuty);
    const res = await app.inject({
      method: 'GET',
      url: `/duties?value=${testDuty.value}`,
    });
    const dutyInserted = await lookForAllDuties({ name: testDuty.name });
    const dutyInsertedId = dutyInserted[0]._id;
    expect(res.body).toContain(dutyInsertedId);
    expect(res.body).toContain(testDuty.name);
  });
});

describe('checks duty schedule endpoint', () => {
  it('makes sure that route returns scheduled duty', async () => {
    await addNewSoldier(testSoldier);
    const dutyForSchedule = await addNewDuty(testDuty);
    const res = await app.inject({
      method: 'PUT',
      url: `/duties/${dutyForSchedule.insertedId}/schedule`,
    });
    expect(res.json().soldiers.length).toBe(1);
    expect(res.json().soldiers[0]._id).toEqual(testSoldier.id);
  });
});
