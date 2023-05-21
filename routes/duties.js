import {
  createNewDuty, lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty,
} from '../database.js';

const newDutySchema = {
  schema: {
    body: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'location', 'time', 'constraints', 'soldiersRequired', 'value'],
      properties: {
        name: { type: 'string' },
        location: { type: 'string' },
        time: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date' },
            end: { type: 'string', format: 'date' },
          },
        },
        constraints: { type: 'array' },
        soldiersRequired: { type: 'number' },
        value: { type: 'number' },
      },

    },
  },

};

const getDutySchema = {
  schema: {
    query: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        location: { type: 'string' },
        time: {
          type: 'object',
          properties: {
            start: { type: 'string', format: 'date' },
            end: { type: 'string', format: 'date' },
          },
        },
        constraints: { type: 'array' },
        soldiersRequired: { type: 'number' },
        value: { type: 'number' },
      },
    },
  },

};

const dutyEditSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    location: { type: 'string' },
    time: {
      type: 'object',
      properties: {
        start: { type: 'string', format: 'date' },
        end: { type: 'string', format: 'date' },
      },
    },
    constraints: { type: 'array' },
    soldiersRequired: { type: 'number' },
    value: { type: 'number' },
  },

};

export default function dutyRouter(app, opts, done) {
  app.post('/', newDutySchema, async (req, res) => {
    const dutyInserted = req.body;
    dutyInserted._id = Math.floor(Math.random() * 1000000);
    await createNewDuty(dutyInserted);
    res.status(201).send({ message: 'duty created' });
  });

  app.get('/', getDutySchema, async (req, res) => {
    const dutiesQuery = req.query;
    const searchResult = await lookForAllDuties(dutiesQuery);
    res.send(searchResult);
  });

  app.get('/:id', async (req, res) => {
    const dutyId = req.params.id;
    const searchResponse = await lookForDutyById(
      { _id: Number(dutyId) },
    );
    if (searchResponse) {
      res.status(200).send({ message: 'duty found' });
    } else {
      res.status(400).send({ message: 'duty not found' });
    }
  });

  app.delete('/:id', async (req, res) => {
    const idForDelete = req.params.id;
    const searchResponse = await lookForDutyById(
      { _id: Number(idForDelete) },
    );
    if (searchResponse) {
      if (searchResponse.soldiers.length === 0) {
        await deleteDutyById(
          { _id: Number(idForDelete) },
        );
        res.status(200).send({ message: 'duty deleted' });
      } else {
        res.status(400).send({ message: 'scheduled duties cannot be deleted' });
      }
    } else {
      res.status(400).send({ message: 'duty doesnt exist' });
    }
  });

  app.patch('/:id', dutyEditSchema, async (req, res) => {
    const dutyToUpdate = req.params.id;
    const updatesToDo = req.body;
    const updatedDuty = await lookForDutyById({ _id: Number(dutyToUpdate) });
    if (updatedDuty !== null) {
      if ((updatedDuty.soldiers.length === 0)) {
        const updateResult = await updateDuty(
          { _id: Number(dutyToUpdate) },
          updatesToDo,
        );
        if (updateResult.modifiedCount === 1) {
          res.status(200).send({ message: 'duty updated' });
        } else {
          res.status(400).send({ message: 'not updated' });
        }
      } else {
        res.status(400).send({ message: 'scheduled duties cannot be changed!' });
      }
    } else {
      res.status(400).send({ message: 'duty doesnt exist!' });
    }
  });
  done();
}
