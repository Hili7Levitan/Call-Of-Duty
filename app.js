import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import swaggerUI from '@fastify/swagger-ui';
import swagger from '@fastify/swagger';
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

app.register(fastifyHelmet);
app.register(swagger, {
  swagger: {
    info: {
      title: 'Call Of Duty API swagger',
      description: 'API documentation for Call Of Duty project',
      version: '1.0.0',
    },
    host: 'http://localhost:3000/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
  exposeRoute: true,
});

app.register(swaggerUI, { prefix: '/api-docs' });
app.register(soldierRouter, { prefix: '/soldiers' });
app.register(dutyRouter, { prefix: '/duties' });
app.register(healthRouter, { prefix: '/health' });
app.register(justiceBoardRouter, { prefix: '/justice-board' });

await app.ready();
app.swagger();

export default app;
