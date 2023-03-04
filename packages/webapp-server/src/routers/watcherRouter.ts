import { Request, Response, Router } from 'express';

const watcherRouter = Router();

watcherRouter.post(
  '/',
  kErrorController.getCluster,
  kErrorController.saveAll,
  (req: Request, res: Response) => {
    console.log(req.body);
    res.status(200).send('OK');
  }
);

export default watcherRouter;
