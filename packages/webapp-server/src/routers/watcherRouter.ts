import { Request, Response, Router } from 'express';
import { kErrorController } from '../controllers/kErrorController';

export const watcherRouter = Router();

watcherRouter.post(
  '/',
  kErrorController.saveAll,
  (req: Request, res: Response) => {
    console.log(req.body);
    res.status(200).send('OK');
  }
);

export default watcherRouter;
