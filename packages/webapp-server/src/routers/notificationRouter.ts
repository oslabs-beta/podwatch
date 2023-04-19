import { Express } from 'express';
import { Request, Response, Router } from 'express';
import { authenticateUser } from '../controllers/authController';
import { kErrorController } from '../controllers/kErrorController';
import { getAllClusters } from '../controllers/clusterController';
import { sendNotification } from '../controllers/notificaitonController';
import { statusController } from '../controllers/statusController';
const router = Router();

// //by clusterID
// router.use(
//   //this needs to be all the clusters that the user has associated with them... user id
//   '/:clusterId',
//   //make sure the user has been authenticated
//   authenticateUser,
//   kErrorController.getClusterFromParams,
//   statusController.getStatus,
//   sendNotification,
//   (req: Request, res: Response) => {
//     res.status(200).send('Text Messages Working');
//   }
// );

router.get(
  //this needs to be all the clusters that the user has associated with them... user id
  '/',
  // //make sure the user has been authenticated
  // authenticateUser,
  // //getting all the clusters associated with the user
  // getAllClusters,
  // //neeed to change notification to filter through all
  // sendNotification,
  (req: Request, res: Response) => {
    res.status(200).send('Text Messages Working');
  }
);
export default router;
