import { ObjectId } from 'mongodb';
import { client } from '../connections.js';

export const dbName = 'CallOfDuty';
export const dutiesDBCollection = 'Duties';

export async function addNewDuty(newDuty) {
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
  const { ...obj } = dutyToInsert;
  const fullInsertedDuty = { _id: result.insertedId, ...obj };
  return fullInsertedDuty;
}

export async function lookForAllDuties(specifiedDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .find(specifiedDuty).toArray();
  return result;
}

export async function lookForDutyById(specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .findOne({ _id: ObjectId(specificDuty) });
  return result;
}

export async function deleteDutyById(specificDuty) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .deleteOne({ _id: ObjectId(specificDuty) });
  return result;
}

export async function updateDuty(specificDuty, fieldsToUpdate) {
  const result = await client.db(dbName).collection(dutiesDBCollection)
    .updateOne({ _id: ObjectId(specificDuty) }, { $set: fieldsToUpdate });
  return result;
}
