import { client } from './connections.js';

export const dbName = 'CallOfDuty';
export const dbCollection = 'Soldiers';

async function addNewSoldier(newSoldier) {
  newSoldier.duties = [];
  const soldierInserted = await client.db(dbName).collection(dbCollection)
    .insertOne(newSoldier);
  return soldierInserted;
}

async function lookForSoldier(specificSoldier) {
  const result = await client.db(dbName).collection(dbCollection)
    .findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(specifiesSoldiers) {
  const result = await client.db(dbName).collection(dbCollection)
    .find(specifiesSoldiers).toArray();
  return result;
}

export { addNewSoldier, lookForSoldier, lookForAllSoldiers };
