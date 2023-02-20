import events from 'events';
import { connectToDB, client } from '../connections.js';
import { addNewSoldier, lookForSoldier, lookForAllSoldiers } from '../database.js';

const eventEmitter = new events.EventEmitter();
eventEmitter.on('load', connectToDB);

const logOptions = {
  level: process.env.logLevel || 'info',
};

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

export default function soldierRouter(app, opts, done) {
  app.logLevel = logOptions;
  app.post('/', { newSoldierSchema }, async (req, res) => {
    const soldier = req.body;
    try {
      await addNewSoldier(client, {
        _id: soldier._id,
        name: soldier.name,
        rank: soldier.rank,
        limitations: soldier.limitations,
      });
    } catch (error) {
      res.status(400).send('soldier not created');
      throw error;
    } res.status(201).send('soldier created');
  });

  app.get('/:id', async (req, res) => {
    const soldierId = req.params.id;
    const searchResponse = await lookForSoldier(
      client,
      { _id: Number(soldierId) },
    );
    if (searchResponse) {
      res.status(200).send('soldier found');
    } else {
      res.status(400).send('soldier not found');
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
    const searchResponses = await lookForAllSoldiers(client, objectSent);
    res.send(searchResponses);
  });
  done();
}
