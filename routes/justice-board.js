import { getJusticeBoard } from '../database.js';

export default function justiceBoardRouter(app, opts, done) {
  app.get('/', async (req, res) => {
    const allSoldiersInDB = await getJusticeBoard();
    res.send(allSoldiersInDB);
  });
  done();
}
