import { Request, Response, Router } from 'express';

export const watcherRouter = Router();

watcherRouter.post('/', (req: Request, res: Response) => {
  console.log(req.body);
  res.send('OK');
});

export default watcherRouter;
