export const dbName = 'CallOfDuty';
export const soldiersDBCollection = 'Soldiers';
export const dutiesDBCollection = 'Duties';

async function addNewSoldier(client, newSoldier) {
  newSoldier.duties = [];
  const soldierInserted = await client.db(dbName).collection(soldiersDBCollection)
    .insertOne(newSoldier);
  return soldierInserted;
}

async function lookForSoldier(client, specificSoldier) {
  const result = await client.db(dbName).collection(soldiersDBCollection).findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(client, specifiedSoldiers) {
  const result = await client.db(dbName).collection(soldiersDBCollection)
    .find(specifiedSoldiers).toArray();
  return result;
}

async function createNewDuty(client, newDuty) {
  newDuty.soldier = [];
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(newDuty);
  return dutyInserted;
}

async function lookForAllDuties(client, specifiedDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .find(specifiedDuty).toArray();
  return result;
}

async function lookForDutyById(client, specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .findOne(specificDuty);
  return result;
}

async function deleteDutyById(client, specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .deleteOne(specificDuty);
  return result;
}

async function updateDuty(client, specificDuty, fieldsToUpdate) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .updateOne(specificDuty, { $set: fieldsToUpdate });
  return result;
}

export {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, createNewDuty,
  lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty,
};
