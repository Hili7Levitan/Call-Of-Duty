export const dbName = 'CallOfDuty';
export const soldiersDBCollection = 'Soldiers';
export const dutiesDBCollection = 'Duties';

async function addNewSoldier(client, newSoldier) {
  newSoldier.duties = [];
  const soldierInserted = await client.db(dbName).collection(soldiersDBCollection).insertOne(newSoldier);
  return soldierInserted;
}

async function lookForSoldier(client, specificSoldier) {
  const result = await client.db(dbName).collection(soldiersDBCollection).findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(client, specifiedSoldiers) {
  const result = await client.db(dbName).collection(soldiersDBCollection).find(specifiedSoldiers).toArray();
  return result;
}

async function createNewDuty(client, specifiedDuty) {
  specifiedDuty.soldier = [];
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection).insertOne(specifiedDuty);
  return dutyInserted;
}

export {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, createNewDuty,
};
