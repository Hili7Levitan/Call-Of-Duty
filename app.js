import Fastify from 'fastify';
import router from './routes/soldiers.js';

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
app.register(router, { prefix: '/health' });

export default app;
