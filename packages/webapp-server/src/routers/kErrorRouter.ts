import { Router } from 'express';
import { kErrorController } from '../controllers/kErrorController';

const kErrorRouter = Router();

kErrorRouter.get(
  '/',
  kErrorController.getCluster,
  kErrorController.getMany,
  (req, res) => {
    res.status(200).json(res.locals.kErrors);
  }
);

export default kErrorRouter;
