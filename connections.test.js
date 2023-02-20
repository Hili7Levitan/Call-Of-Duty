import { describe, expect, it } from 'vitest';
import { connectToDB } from './connections.js';

describe('checks db connection function', () => {
  it('Should connect to DB', async () => {
    const res = await connectToDB();
    expect(res).toBeTruthy();
  });
});
