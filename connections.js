import { MongoClient } from 'mongodb';
import 'dotenv/config.js';

const uri = process.env.MONGO_URI;
export const client = new MongoClient(uri);

export async function connectToDB() {
  await client.connect();
  return true;
}
