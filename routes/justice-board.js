import { getJusticeBoard } from '../database/justice-board-repository.js';

export default async function justiceBoardRouter(app) {
  app.get('/', async (req, res) => {
    const justiceBoard = await getJusticeBoard();
    res.send(justiceBoard);
  });
}
