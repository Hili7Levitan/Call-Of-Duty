import { describe, expect, it } from 'vitest';
import { connectToDB, client } from '../connections.js';

describe('checks db connection function', () => {
  it('Should connect to DB', async () => {
    const res = await connectToDB();
    expect(res).toEqual(true);
  });

  it('should get a ping from DB', async () => {
    const res = await client.db('CallOfDuty').command({ ping: 1 });
    expect(res).toEqual({ ok: 1 });
  });
});
