import {
  createCluster,
  getAllClusters,
  getCluster,
  updateCluster,
  deleteCluster,
  addNotification,
} from '../controllers/clusterController';
import { authenticateUser } from '../controllers/authController';
import { Request, Response, Router } from 'express';

const router = Router();

// router.use('/', (req: Request, res: Response) => {
//   res.send('HELLO');
// });
//get all clusters associated with user
router.get(
  '/',
  authenticateUser,
  getAllClusters,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.allClusters);
  }
);

//create cluster associated with user
router.post(
  '/',
  authenticateUser,
  createCluster,
  (req: Request, res: Response) => {
    return res.status(201).json({
      cluster: res.locals.newCluster,
      secret: res.locals.newSecret,
    });
  }
);

//get specific cluster
router.get(
  '/:id',
  authenticateUser,
  getCluster,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.getCluster);
  }
);

//create a notification setting for specific cluster
router.patch(
  '/:id/addNotification',
  authenticateUser,
  addNotification,
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.getCluster);
  }
);

//update specific cluster

router.patch(
  '/:id',
  authenticateUser,
  updateCluster,
  (req: Request, res: Response) => {
    return res.status(201).json(res.locals.getCluster);
  }
);

//delete specific cluster

router.delete(
  '/:id',
  authenticateUser,
  deleteCluster,
  (req: Request, res: Response) => {
    return res.status(200).json(res.locals.getCluster);
  }
);

export default router;
