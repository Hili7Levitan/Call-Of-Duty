/* eslint-disable no-plusplus */
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
  newDuty.soldiers = ['58506981'];
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

async function getJusticeBoard(client) {
  const result = await client.db(dbName).collection(soldiersDBCollection).aggregate([
    {
      $lookup: {
        from: dutiesDBCollection,
        localField: '_id',
        foreignField: 'soldiers',
        as: 'scheduledDutyDetails',
      },
    },
    { $unwind: { path: '$scheduledDutyDetails', preserveNullAndEmptyArrays: true } },
    { $group: { _id: '$_id', score: { $sum: '$scheduledDutyDetails.value' } } },
    { $sort: { score: 1 } },
  ]).toArray();
  return result;
}

async function scheduleDuty(client, duty) {
  const fullDuty = await client.db(dbName).collection(dutiesDBCollection)
    .findOne({ _id: Number(duty) });
  const numberOfSoldiersRequired = fullDuty.soldiersRequired;
  if (fullDuty.constraints) {
    const bla = await client.db(dbName).collection(soldiersDBCollection)
      .find({ limitations: { $ne: fullDuty.constraints } }).toArray();
    const map1 = bla.map((x) => x._id);
    const currentJustice = await client.db(dbName).collection(dutiesDBCollection).aggregate([
      { $unwind: '$soldiers' },
      { $group: { _id: '$soldiers', score: { $sum: '$value' } } },
      { $sort: { score: 1 } },
    ]).toArray();
    const constrainedSoldiers = map1.some((element) => currentJustice.includes(`_id: ${element}`));
    // if (constrainedSoldiers === true) {

    // }
    const soldiersSelected = currentJustice.slice(0, numberOfSoldiersRequired);
    const dutyAfterSchedule = duty;
    dutyAfterSchedule.soldiers = soldiersSelected;
    return dutyAfterSchedule;
  }
  console.log('bammer');
}

export {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, createNewDuty,
  lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty, getJusticeBoard, scheduleDuty,
};
