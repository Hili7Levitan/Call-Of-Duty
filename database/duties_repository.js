import { client } from '../connections.js';

export const dbName = 'CallOfDuty';
export const dutiesDBCollection = 'Duties';

async function addNewDuty(newDuty) {
  const dutyToInsert = {
    name: newDuty.name,
    location: newDuty.location,
    time: newDuty.time,
    constraints: newDuty.constraints,
    soldiersRequired: newDuty.soldiersRequired,
    value: newDuty.value,
  };
  dutyToInsert.soldiers = [];
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(dutyToInsert);
  return dutyInserted;
}

async function lookForAllDuties(specifiedDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .find(specifiedDuty).toArray();
  return result;
}

async function lookForDutyById(specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .findOne(specificDuty);
  return result;
}

async function deleteDutyById(specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .deleteOne(specificDuty);
  return result;
}

async function updateDuty(specificDuty, fieldsToUpdate) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .updateOne(specificDuty, { $set: fieldsToUpdate });
  return result;
}

export {
  addNewDuty,
  lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty,
};
