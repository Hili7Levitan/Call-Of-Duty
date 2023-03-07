import Fastify from 'fastify';
import soldierRouter from './routes/soldiers.js';
import dutyRouter from './routes/duties.js';
import healthRouter from './routes/health.js';
import justiceBoardRouter from './routes/justice-board.js';

const logOptions = {
  level: process.env.logLevel || 'info',
};
const app = Fastify({
  logger: logOptions,
});

app.register(soldierRouter, { prefix: '/soldiers' });
app.register(dutyRouter, { prefix: '/duties' });
app.register(healthRouter, { prefix: '/health' });
app.register(justiceBoardRouter, { prefix: '/justice-board' });

export default app;
