import { Request, Response, Router } from 'express';
import { kErrorController } from '../controllers/kErrorController';

const watcherRouter = Router();

watcherRouter.post(
  '/',
  kErrorController.getClusterFromHeaders,
  kErrorController.saveAll,
  (req: Request, res: Response) => {
    res.status(200).send('OK');
  }
);

export default watcherRouter;
