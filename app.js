import Fastify from 'fastify';
import events from 'events';
import { connectToDB } from './connections.js';
import router from './routes/soldiers.js';

const eventEmitter = new events.EventEmitter();
eventEmitter.on('load', connectToDB);

const logOptions = {
  level: process.env.logLevel || 'info',
};
const app = Fastify({
  logger: logOptions,
});

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});
app.register(router, { prefix: '/soldiers' });

export default app;
