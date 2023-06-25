import { addNewSoldier, lookForSoldier, lookForAllSoldiers } from '../database/soldiers-repository.js';

const soldierProperties = {
  id: { type: 'string' },
  name: { type: 'string' },
  rank: { type: 'string' },
  limitations: { type: 'array' },
};

const newSoldierSchema = {
  schema: {
    body: {
      type: 'object',
      additionalProperties: false,
      required: ['id', 'name', 'rank', 'limitations'],
      properties: soldierProperties,
    },
  },
};

export default async function soldiersRouter(app) {
  app.post('/', newSoldierSchema, async (req, res) => {
    const soldier = req.body;
    try {
      const insertedSoldier = await addNewSoldier(soldier);
      return res.status(201).send(insertedSoldier);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).send({ message: 'soldier not created - this id already exists!' });
      }
      return res.status(500).send({ message: 'server error' });
    }
  });

  app.get('/:id', async (req, res) => {
    try {
      const soldierId = req.params.id;
      const searchResponse = await lookForSoldier({ _id: soldierId });
      if (searchResponse) {
        return res.status(200).send(searchResponse);
      }
      return res.status(404).send({ message: 'soldier not found' });
    } catch (error) {
      app.log.error(error);
      return res.status(500).send({ message: 'server error' });
    }
  });

  app.get('/', async (req, res) => {
    const soldierQuery = req.query;
    const searchResponses = await lookForAllSoldiers(soldierQuery);
    return res.send(searchResponses);
  });
}
