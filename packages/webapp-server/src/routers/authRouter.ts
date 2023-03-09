import { Request, Response, Router } from 'express';
import {
  registerWithEmailAndPw,
  loginWithEmailAndPw,
  generateJwt,
} from '../controllers/authController';
import passport from 'passport';

const authRouter = Router();

authRouter.post(
  '/local/signup',
  registerWithEmailAndPw,
  generateJwt,
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  }
);

authRouter.post(
  '/local/signin',
  loginWithEmailAndPw,
  generateJwt,
  (req: Request, res: Response) => {
    res.status(200).json(req.user);
  }
);

// Google Auth Routes

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google'),
  generateJwt,
  (req: Request, res: Response) => {
    res.redirect('/dashboard/1');
  }
);

authRouter.get('/signout', (req: Request, res: Response) => {
  res.clearCookie('podwatch', {
    signed: true,
    secure: true,
    httpOnly: true,
  });

  req.logout((err: any) => {
    return res.status(500).send(err);
  });
  res.status(200).send();
});

export default authRouter;
