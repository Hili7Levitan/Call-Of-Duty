import {
  addNewDuty, lookForAllDuties, lookForDutyById, deleteDutyById, updateDuty,
} from '../database/duties-repository.js';

const dutyProperties = {
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
};

const newDutySchema = {
  schema: {
    body: {
      type: 'object',
      additionalProperties: false,
      required: ['name', 'location', 'time', 'constraints', 'soldiersRequired', 'value'],
      properties: dutyProperties,
    },
  },
};

const getDutySchema = {
  schema: {
    query: {
      type: 'object',
      properties: dutyProperties,
    },
  },
};

const dutyEditSchema = {
  schema: {
    params: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
      },
    },
    body: {
      type: 'object',
      properties: dutyProperties,
    },
  },
};

export default async function dutyRouter(app) {
  app.post('/', newDutySchema, async (req, res) => {
    const dutyInserted = req.body;
    const dutyCreated = await addNewDuty(dutyInserted);
    const fullDutyCreated = await lookForDutyById(dutyCreated.insertedId);
    res.status(201).send(fullDutyCreated);
  });

  app.get('/', getDutySchema, async (req, res) => {
    const dutiesQuery = req.query;
    const searchResult = await lookForAllDuties(dutiesQuery);
    res.send(searchResult);
  });

  app.get('/:id', async (req, res) => {
    const dutyId = req.params.id;
    const searchResponse = await lookForDutyById(dutyId);
    if (searchResponse) {
      res.status(200).send({ message: 'duty found' });
    } else {
      res.status(400).send({ message: 'duty not found' });
    }
  });

  app.delete('/:id', async (req, res) => {
    const idForDelete = req.params.id;
    const searchResponse = await lookForDutyById(idForDelete);
    if (!searchResponse) {
      return res.status(400).send({ message: 'duty doesnt exist' });
    }
    if (searchResponse.soldiers.length !== 0) {
      return res.status(400).send({ message: 'scheduled duties cannot be deleted' });
    }
    await deleteDutyById(idForDelete);
    return res.status(200).send({ message: 'duty deleted' });
  });

  app.patch('/:id', dutyEditSchema, async (req, res) => {
    const dutyToUpdate = req.params.id;
    const updatesToDo = req.body;
    const updatedDuty = await lookForDutyById(dutyToUpdate);
    if (!updatedDuty) {
      res.status(400).send({ message: 'duty doesnt exist!' });
    }
    if (updatedDuty.soldiers.length !== 0) {
      res.status(400).send({ message: 'scheduled duties cannot be changed!' });
    } else {
      const updateResult = await updateDuty(dutyToUpdate, updatesToDo);
      if (updateResult.modifiedCount === 1) {
        res.status(200).send({ message: 'duty updated' });
      } else {
        res.status(400).send({ message: 'not updated' });
      }
    }
  });
}
