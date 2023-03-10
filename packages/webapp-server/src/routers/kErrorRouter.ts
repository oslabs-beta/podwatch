import { Router } from 'express';
import { kErrorController } from '../controllers/kErrorController';
import { authenticateUser } from '../controllers/authController';

const kErrorRouter = Router();

kErrorRouter.get(
  '/',
  authenticateUser,
  kErrorController.getCluster,
  kErrorController.getMany,
  (req, res) => {
    return res.status(200).json(res.locals.kErrors);
  }
);

kErrorRouter.get(
  '/:id',
  authenticateUser,
  kErrorController.getCluster,
  kErrorController.getOne,
  (req, res) => {
    res.status(200).json(res.locals.kError);
  }
);

export default kErrorRouter;