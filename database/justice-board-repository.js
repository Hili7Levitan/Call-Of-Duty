import { client } from '../connections.js';
import { dbName, soldiersDBCollection } from './soldiers-repository.js';
import { dutiesDBCollection } from './duties-repository.js';

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

export default getJusticeBoard;
