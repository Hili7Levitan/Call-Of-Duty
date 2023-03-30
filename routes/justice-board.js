import getJusticeBoard from '../database/justice-board-repository.js';

export default async function justiceBoardRouter(app) {
  app.get('/', async (req, res) => {
    const justiceBoard = await getJusticeBoard();
    res.send(justiceBoard);
  });

  app.get('/:id', async (req, res) => {
    const dutyForSchedule = req.params.id;
    console.log(dutyForSchedule);
    const scheduledDuty = await scheduleDuty(client, dutyForSchedule);
    res.send(scheduledDuty);
  });
}
