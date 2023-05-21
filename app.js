import Fastify from 'fastify';
import soldierRouter from './routes/soldiers.js';
import dutyRouter from './routes/duties.js';

const logOptions = {
  level: process.env.logLevel || 'info',
};
const app = Fastify({
  logger: logOptions,
});

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});
app.register(soldierRouter, { prefix: '/soldiers' });
app.register(dutyRouter, { prefix: '/duties' });

export default app;
