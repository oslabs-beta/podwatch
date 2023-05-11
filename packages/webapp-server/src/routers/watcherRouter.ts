import { Request, Response, Router } from 'express';
import { kErrorController } from '../controllers/kErrorController';
import { sendNotification } from '../controllers/notificationController';

const watcherRouter = Router();

watcherRouter.post(
  '/',
  kErrorController.getClusterFromHeaders,
  sendNotification,
  kErrorController.saveAll,
  (req: Request, res: Response) => {
    res.status(200).send('OK');
  }
);

export default watcherRouter;
