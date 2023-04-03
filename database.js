import { client } from './connections.js';

export const dbName = 'CallOfDuty';
export const soldiersDBCollection = 'Soldiers';
export const dutiesDBCollection = 'Duties';

async function addNewSoldier(newSoldier) {
  newSoldier.duties = [];
  const soldierInserted = await client.db(dbName).collection(soldiersDBCollection)
    .insertOne(newSoldier);
  return soldierInserted;
}

async function lookForSoldier(specificSoldier) {
  const result = await client.db(dbName).collection(soldiersDBCollection).findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(specifiedSoldiers) {
  const result = await client.db(dbName).collection(soldiersDBCollection)
    .find(specifiedSoldiers).toArray();
  return result;
}

async function createNewDuty(newDuty) {
  newDuty.soldiers = [];
  const dutyInserted = await client.db(dbName).collection(dutiesDBCollection)
    .insertOne(newDuty);
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

async function updateSoldier(specificSoldier) {
  console.log(specificSoldier);
  const result = await client.db(dbName).collection(soldiersDBCollection)
    .updateOne({ specificSoldier }, { $set: { rank: { $add: ['$rank', '$rankAdded'] } } });
  return result;
}

async function getJusticeBoard() {
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

async function scheduleDuty(duty) {
  const fullDuty = await client.db(dbName).collection(dutiesDBCollection)
    .findOne({ _id: Number(duty) });
  const numberOfSoldiersRequired = fullDuty.soldiersRequired;
  if (fullDuty.soldiers.length === 0) {
    const currentJustice = await client.db(dbName).collection(soldiersDBCollection).aggregate([
      { $match: { limitations: { $nin: fullDuty.constraints } } },
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
    const soldiersSelected = currentJustice.slice(0, numberOfSoldiersRequired);
    const dutyAfterSchedule = fullDuty;
    dutyAfterSchedule.soldiers = soldiersSelected;
    updateDuty({ _id: Number(duty) }, dutyAfterSchedule);
    const scheduledIds = soldiersSelected.map((x) => x._id);
    const updateRank = await client.db(dbName).collection(soldiersDBCollection).aggregate([
      { $match: { _id: { $in: scheduledIds } } },
      { $addFields: { rankAdded: fullDuty.value } },
      // { $set: { rank: { $add: ['$rank', '$rankAdded'] } } },
      // { $unset: 'rankAdded' },
    ]).toArray();

    for (let i = 0; i < updateRank.length; i += 1) {
      console.log(updateRank[i]);
      updateSoldier({ _id: Number(updateRank[i]._id) });
    }
    return dutyAfterSchedule;
  }
  return ('oops! duty is already scheduled');
}
// add update rank after schedule and make sure chenges update in db and update soldier duties

export {
  addNewSoldier, lookForSoldier, lookForAllSoldiers, createNewDuty,
  lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty, getJusticeBoard, scheduleDuty,
};
