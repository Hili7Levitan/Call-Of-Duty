import { createNewDuty } from '../database.js';
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
  done();
}
