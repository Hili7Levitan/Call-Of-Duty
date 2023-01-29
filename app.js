import Fastify from 'fastify';

const logOptions = {
  level: process.env.logLevel || 'info',
};

const app = Fastify({
  logger: logOptions,
});

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

export default app;
