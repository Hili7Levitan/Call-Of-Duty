import Fastify from 'fastify';
import soldiersRouter from './routes/soldiers.js';
import healthRouter from './routes/health.js';

const logOptions = {
  level: process.env.logLevel || 'info',
};
const app = Fastify({
  logger: logOptions,
});

app.register(soldiersRouter, { prefix: '/soldiers' });
app.register(healthRouter, { prefix: '/health' });

export default app;
