import { getJusticeBoard } from '../database.js';
import { client } from '../connections.js';

export default function justiceBoardRouter(app, opts, done) {
  app.get('/', async (req, res) => {
    const justiceBoard = await getJusticeBoard(client);
    res.send(justiceBoard);
  });
  done();
}
