import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
export const client = new MongoClient(uri);

export async function connectToDB() {
  try {
    await client.connect();
    return true;
  } catch (error) {
    return false;
  }
}
