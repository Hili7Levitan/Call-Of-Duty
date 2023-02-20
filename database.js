export const dbName = 'CallOfDuty';
export const dbCollection = 'Soldiers';

async function addNewSoldier(client, newSoldier) {
  newSoldier.duties = [];
  const soldierInserted = await client.db(dbName).collection(dbCollection).insertOne(newSoldier);
  return soldierInserted;
}

async function lookForSoldier(client, specificSoldier) {
  const result = await client.db(dbName).collection(dbCollection).findOne(specificSoldier);
  return result;
}

async function lookForAllSoldiers(client, specifiesSoldiers) {
  const result = await client.db(dbName).collection(dbCollection).find(specifiesSoldiers).toArray();
  return result;
}

export { addNewSoldier, lookForSoldier, lookForAllSoldiers };
