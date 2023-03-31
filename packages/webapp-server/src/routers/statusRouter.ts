import { Request, Response, Router } from 'express';
import { authenticateUser } from '../controllers/authController';
import { kErrorController } from '../controllers/kErrorController';
import { statusController } from '../controllers/statusController';

const statusRouter = Router();

statusRouter.post(
  '/',
  kErrorController.getClusterFromHeaders,
  statusController.processHeartbeat,
  (req: Request, res: Response) => {
    res.sendStatus(200);
  }
);

statusRouter.get(
  '/:clusterId',
  authenticateUser,
  kErrorController.getClusterFromParams,
  statusController.getStatus,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.status);
  }
);

export default statusRouter;
