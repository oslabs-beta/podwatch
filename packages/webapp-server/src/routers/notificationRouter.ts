import { Express } from 'express';
import { Request, Response, Router } from 'express';
import { authenticateUser } from '../controllers/authController';
import { kErrorController } from '../controllers/kErrorController';
import { getAllClusters } from '../controllers/clusterController';
import { sendNotification } from '../controllers/notificaitonController';
import { statusController } from '../controllers/statusController';
const router = Router();

router.get(
  //this needs to be all the clusters that the user has associated with them... user id
  '/:clusterId',
  //make sure the user has been authenticated
  authenticateUser,
  kErrorController.getClusterFromParams,
  statusController.getStatus,
  sendNotification,
  (req: Request, res: Response) => {
    res.status(200).send('Text Messages Working');
  }
);

// router.get(
//   //this needs to be all the clusters that the user has associated with them... user id
//   '/',
//   //make sure the user has been authenticated
//   authenticateUser,
//   getAllClusters,
//   sendNotification,
//   (req: Request, res: Response) => {
//     res.status(200).send('Text Messages Working');
//   }
// );

export default router;
