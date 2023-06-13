import { client } from '../connections.js';
import { dbName, soldiersDBCollection, updateScheduledSoldier } from './soldiers-repository.js';
import { dutiesDBCollection, updateDuty, lookForDutyById } from './duties-repository.js';

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

async function scheduleDuty(dutyId) {
  const fullDuty = await lookForDutyById(dutyId);
  const numberOfSoldiersRequired = fullDuty.soldiersRequired;
  if (!fullDuty.soldiers.length) {
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
      { $limit: numberOfSoldiersRequired },
    ]).toArray();
    await updateDuty(dutyId, { soldiers: currentJustice });
    Promise.all(currentJustice.map((soldier) => updateScheduledSoldier(
      soldier._id,
      fullDuty.value,
      dutyId,
    )));
    const dutyAfterSchedule = await lookForDutyById(dutyId);
    return dutyAfterSchedule;
  }
  return ({ message: 'oops! duty is already scheduled' });
}

export { getJusticeBoard, scheduleDuty };
