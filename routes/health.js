export default async function router(app, opts, done) {
  app.get('/health', (req, res) => {
    res.status(200).send('ok');
  });
  done();
}
