import { ObjectId } from 'mongodb';
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
    soldiers: [],
  };
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(dutyToInsert);
  return result;
}

async function lookForAllDuties(specifiedDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .find(specifiedDuty).toArray();
  return result;
}

async function lookForDutyById(specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .findOne({ _id: ObjectId(specificDuty) });
  return result;
}

async function deleteDutyById(specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .deleteOne({ _id: ObjectId(specificDuty) });
  return result;
}

async function updateDuty(specificDuty, fieldsToUpdate) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .updateOne({ _id: ObjectId(specificDuty) }, { $set: fieldsToUpdate });
  return result;
}

export {
  addNewDuty,
  lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty,
};
