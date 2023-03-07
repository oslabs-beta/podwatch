import {
  createCluster,
  getAllClusters,
  getCluster,
  updateCluster,
  deleteCluster,
} from '../controllers/clusterController';
import { authenicateUser } from '../controllers/authUserController';
import { Request, Response, Router } from 'express';

const router = Router();
//get all clusters associated with user
router.get(
  '/',
  authenicateUser,
  getAllClusters,
  (req: Request, res: Response) => {
    return res.status(200).send(res.locals.allClusters);
  }
);

//create cluster associated with user
router.post(
  '/',
  authenicateUser,
  createCluster,
  (req: Request, res: Response) => {
    return res.status(201).send(res.locals.newCluster);
  }
);

//get specific cluster
router.get(
  '/:id',
  authenicateUser,
  getCluster,
  (req: Request, res: Response) => {
    return res.status(200).send(res.locals.getCluster);
  }
);

//update specific cluster

router.patch(
  '/:id',
  authenicateUser,
  updateCluster,
  (req: Request, res: Response) => {
    return res.status(200).send(res.locals.getCluster);
  }
);

//delete specific cluster

router.delete(
  '/:id',
  authenicateUser,
  deleteCluster,
  (req: Request, res: Response) => {
    return res.status(200).send(res.locals.getCluster);
  }
);

export default router;
