import {
  createNewDuty, lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty,
} from '../database.js';
import { client } from '../connections.js';

const newDutySchema = {
  body: {
    type: 'object',
    required: ['name', 'location', 'time', 'constraints', 'soldiersRequired', 'value'],
    properties: {
      name: { type: 'string' },
      location: { type: 'string' },
      time: { type: 'ISODate' },
      constraints: { type: 'array' },
      soldiersRequired: { type: 'integer' },
      value: { type: 'integer' },
    },

  },
};

export default function dutyRouter(app, opts, done) {
  app.post('/', { newDutySchema }, async (req, res) => {
    const dutyInserted = req.body;
    dutyInserted._id = Math.floor(Math.random() * 1000000);
    await createNewDuty(client, dutyInserted);
    res.status(201).send('duty created');
  });

  app.get('/', async (req, res) => {
    const dutiesQuery = req.query;
    const objectSent = {};
    if (dutiesQuery.name) {
      objectSent.name = dutiesQuery.name;
    }
    if (dutiesQuery.location) {
      objectSent.location = Number(dutiesQuery.location);
    }
    if (dutiesQuery.time) {
      objectSent.time = dutiesQuery.time;
    }
    if (dutiesQuery.constraints) {
      objectSent.constraints = dutiesQuery.constraints;
    }
    if (dutiesQuery.soldiersRequired) {
      objectSent.soldiersRequired = Number(dutiesQuery.soldiersRequired);
    }
    if (dutiesQuery.value) {
      objectSent.value = dutiesQuery.value;
    }
    const searchResult = await lookForAllDuties(client, objectSent);
    if (searchResult) {
      res.send(searchResult);
    } else {
      res.send('found nothing');
    }
  });

  app.get('/:id', async (req, res) => {
    const dutyId = req.params.id;
    const searchResponse = await lookForDutyById(
      client,
      { _id: Number(dutyId) },
    );
    if (searchResponse) {
      res.status(200).send('duty found');
    } else {
      res.status(400).send('duty not found');
    }
  });

  app.delete('/:id', async (req, res) => {
    const idForDelete = req.params.id;
    const searchResponse = await lookForDutyById(
      client,
      { _id: Number(idForDelete) },
    );
    if (searchResponse) {
      await deleteDutyById(
        client,
        { _id: Number(idForDelete) },
      );
      res.status(200).send('duty deleted');
    } else {
      res.status(400).send('duty doesnt exist');
    }
  });

  app.patch('/:id', { newDutySchema }, async (req, res) => {
    const dutyToUpdate = req.params.id;
    const updatesToDo = req.body;
    const updateResult = await updateDuty(
      client,
      { _id: Number(dutyToUpdate) },
      updatesToDo,
    );
    if (updateResult.modifiedCount === 1) {
      res.send('duty updated');
    } else {
      res.send('not updated');
    }
  });
  done();
}
