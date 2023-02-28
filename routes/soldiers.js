import { addNewSoldier, lookForSoldier, lookForAllSoldiers } from '../database.js';

const newSoldierSchema = {
  body: {
    type: 'object',
    required: ['_id', 'name', 'rank', 'limitations'],
    properties: {
      _id: { type: 'integer' },
      name: { type: 'string' },
      rank: { type: 'integer' },
      limitations: { type: 'array' },
    },

  },
};

export default async function router(app, opts, done) {
  app.post('/', { newSoldierSchema }, async (req, res) => {
    const soldier = req.body;
    try {
      await addNewSoldier({
        _id: soldier._id,
        name: soldier.name,
        rank: soldier.rank,
        limitations: soldier.limitations,
      });
      res.status(201).send('soldier created');
    } catch (error) {
      res.status(400).send('soldier not created');
      throw error;
    }
  });

  app.get('/:id', async (req, res) => {
    const soldierId = req.params.id;
    const searchResponse = await lookForSoldier(
      { _id: Number(soldierId) },
    );
    if (searchResponse) {
      res.status(200).send('soldier found');
    } else {
      res.status(500).send('soldier not found');
    }
  });

  app.get('/', async (req, res) => {
    const soldierQuery = req.query;
    const objectSent = {};
    if (soldierQuery.id) {
      objectSent._id = Number(soldierQuery.id);
    }
    if (soldierQuery.name) {
      objectSent.name = soldierQuery.name;
    }
    if (soldierQuery.rank) {
      objectSent.rank = Number(soldierQuery.rank);
    }
    if (soldierQuery.limitations) {
      objectSent.limitations = soldierQuery.limitations;
    }
    const searchResponses = await lookForAllSoldiers(objectSent);
    res.send(searchResponses);
  });
  done();
}
