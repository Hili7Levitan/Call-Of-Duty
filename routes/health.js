export default async function healthRouter(app) {
  app.get('/', (req, res) => res.status(200).send({ message: 'ok' }));
}
