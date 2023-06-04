import { client } from '../connections.js';

export const dbName = 'CallOfDuty';
export const soldiersDBCollection = 'Soldiers';

async function addNewSoldier(newSoldier) {
  const soldierToInsert = {
    _id: newSoldier.id,
    rank: newSoldier.rank,
    name: newSoldier.name,
    limitations: newSoldier.limitations,
  };
  soldierToInsert.duties = [];
  const result = await client.db(dbName).collection(soldiersDBCollection)
    .insertOne(soldierToInsert);
  return result;
}

async function lookForSoldier(specificSoldier) {
  if (specificSoldier.id) {
    const { id, ...obj } = specificSoldier;
    const newSpecificSoldier = { _id: id, ...obj };
    const result = await client.db(dbName).collection(soldiersDBCollection)
      .findOne(newSpecificSoldier);
    return result;
  }
  const result = await client.db(dbName).collection(soldiersDBCollection)
    .findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(specifiedSoldiers) {
  if (specifiedSoldiers.id) {
    const { id, ...obj } = specifiedSoldiers;
    const newSpecifiedSoldier = { _id: id, ...obj };
    const result = await client.db(dbName).collection(soldiersDBCollection)
      .find(newSpecifiedSoldier).toArray();
    return result;
  }
  const result = await client.db(dbName).collection(soldiersDBCollection)
    .find(specifiedSoldiers).toArray();
  return result;
}

export {
  addNewSoldier, lookForSoldier, lookForAllSoldiers,
};