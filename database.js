import { client } from './connections.js';

export const dbName = 'CallOfDuty';
export const dbCollection = 'Soldiers';

async function addNewSoldier(newSoldier) {
  const soldierToInsert = {
    _id: newSoldier.id,
    rank: newSoldier.rank,
    name: newSoldier.name,
    limitations: newSoldier.limitations,
  };
  soldierToInsert.duties = [];
  const result = await client.db(dbName).collection(dbCollection)
    .insertOne(soldierToInsert);
  return result;
}

async function lookForSoldier(specificSoldier) {
  if (specificSoldier.id) {
    const { id, ...obj } = specificSoldier;
    const newSpecificSoldier = { _id: id, ...obj };
    const result = await client.db(dbName).collection(dbCollection)
      .findOne(newSpecificSoldier);
    return result;
  }
  const result = await client.db(dbName).collection(dbCollection)
    .findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(specifiedSoldiers) {
  if (specifiedSoldiers.id) {
    const { id, ...obj } = specifiedSoldiers;
    const newSpecifiedSoldier = { _id: id, ...obj };
    const result = await client.db(dbName).collection(dbCollection)
      .find(newSpecifiedSoldier).toArray();
    return result;
  }
  const result = await client.db(dbName).collection(dbCollection)
    .find(specifiedSoldiers).toArray();
  return result;
}

export { addNewSoldier, lookForSoldier, lookForAllSoldiers };
