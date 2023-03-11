import { Router } from 'express';
import { kErrorController } from '../controllers/kErrorController';
import { authenticateUser } from '../controllers/authController';

const kErrorRouter = Router();

kErrorRouter.get(
  '/:clusterId',
  authenticateUser,
  kErrorController.getClusterFromParams,
  kErrorController.getMany,
  (req, res) => {
    return res.status(200).json(res.locals.kErrors);
  }
);

kErrorRouter.get(
  '/:clusterId/:id',
  authenticateUser,
  kErrorController.getClusterFromParams,
  kErrorController.getOne,
  (req, res) => {
    res.status(200).json(res.locals.kError);
  }
);

export default kErrorRouter;
