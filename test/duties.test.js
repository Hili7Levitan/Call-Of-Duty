import {
  afterAll,
  beforeAll, beforeEach, describe, expect, it,
} from 'vitest';
import { client } from '../connections.js';
import app from '../app.js';
import { dbName, dutiesDBCollection, createNewDuty, updateDuty } from '../database.js';

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
    start: "2023-04-01",
    end: "2023-04-02",
  },
  constraints: ['bla', 'bla'],
  soldiersRequired: 2,
  value: 8,
};

describe('Post duties route', () => {
  it('checks that status is 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/duties',
      body: testDuty,
    });
    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({message: 'duty created'});
  });
});

describe('Get all duties route', () => {
  it('checks that route returns an array', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'GET',
      url: `/duties?name=+${testDuty.name}`,
    });
    expect(res.body).toContain('[]');
  });
});

describe('Get duty by id route', () => {
  it('checks that when duty is found status is 200', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'GET',
      url: `/duties/+${testDuty._id}`,
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
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'DELETE',
      url: `/duties/+${testDuty._id}`,
    });
    expect(res.statusCode).toBe(200);
  });
  it('checks that when a duty doesnt exist status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'DELETE',
      url: `/duties/+6${testDuty._id}`,
    });
    expect(res.statusCode).toBe(400);
  });
  it('checks that when a duty is already scheduled status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    await updateDuty(
      { _id: Number(testDuty._id)},{soldiers: [9033544]}
       );
    const res = await app.inject({
      method: 'DELETE',
      url: `/duties/+${testDuty._id}`,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'scheduled duties cannot be deleted' })
  });
});

const testParamsToChange = {
  location: 'here',
  name: 'nooooo',
};
describe('Patch duty route', () => {
  it('checks that when a duty is updated status is 200', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/+${testDuty._id}`,
      body: testParamsToChange ,
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ message: 'duty updated' })
  });
  it('checks that when a duty is not updated status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/+${testDuty._id}`,
      body: { name: testDuty.name} ,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'not updated' })
  });
  it('checks that when a duty is already scheduled status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    await updateDuty(
      { _id: Number(testDuty._id)},{soldiers: [9033544]}
       );
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/+${testDuty._id}`,
      body: { name: testDuty.name} ,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'scheduled duties cannot be changed!' })
  });
  it('checks that when a duty desnt exist status is 400', async () => {
    testDuty._id = 9033543;
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'PATCH',
      url: `/duties/+6${testDuty._id}`,
      body: testParamsToChange,
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toEqual({ message: 'duty doesnt exist!' })
  });
});


describe('Get duty endpoint', () => {
  it('checks that when a duties are searched by parameters the right objects are returned', async () => {
    await createNewDuty(testDuty);
    const res = await app.inject({
      method: 'GET',
      url: `/duties?value=+${testDuty.value}`,
    });
    expect(res.body).toContain(testDuty._id)
    expect(res.body).toContain(testDuty.name)
  })
})
