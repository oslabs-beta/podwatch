import { authenticateUser } from './../controllers/authController';
import { Request, Response, Router } from 'express';
import {
  registerWithEmailAndPw,
  loginWithEmailAndPw,
  generateJwt,
} from '../controllers/authController';
import passport from 'passport';

const authRouter = Router();

authRouter.get('/user', authenticateUser, (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});

authRouter.post(
  '/local/signup',
  registerWithEmailAndPw,
  generateJwt,
  (req: Request, res: Response) => {
    res.status(200).send();
  }
);

authRouter.post(
  '/local/signin',
  loginWithEmailAndPw,
  generateJwt,
  (req: Request, res: Response) => {
    res.status(200).send();
  }
);

// Google Auth Routes

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  generateJwt,
  (req: Request, res: Response) => {
    res.redirect('http://localhost:3000/cluster');
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
