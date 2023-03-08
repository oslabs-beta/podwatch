import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import jwt from "jsonwebtoken";
import { UserDocument } from '../models/UserModel';
import passport from 'passport';

/**
 * This middleware function will log a user in with the provided email and password. It will then set the user's id on the session and set the user on res.locals.user. It will then call next() to allow the request to continue. If the email or password are not provided, this function will throw an error. If the email is not found in the database, or if the password does not match the password in the database, this function will throw an error.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const loginWithEmailAndPw = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body; // Abc123
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    } else {
        const userAuthenticated = await user.comparePassword(password);
    if (!userAuthenticated) {
      throw new Error('Invalid email or password');
    }

    generateJwt(user, res);

    req.user = user;

    return next();
    }
  } catch (error) {
    return next(error);
  }
};

/**
 * This middleware function will register a new user with the provided email and password. It will hash the password before saving it to the database. It will then set the user's id on the session and set the user on res.locals.user. It will then call next() to allow the request to continue.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const registerWithEmailAndPw = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // TODO: Validate email is in correct format and password is long enough with required characters

    // TODO: Check if email is already in use

    const user = new UserModel({
      email,
      password,
      provider: 'local',
    });

    await user.save();

    generateJwt(user, res);

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

export const generateJwt = (req: Request, res: Response, next: NextFunction) => {

  const user = req.user;

  if (!user) {
    return next({
      
    })
  }

  const token = jwt.sign({
    sub: user.id,
    email: user.email
  }, process.env.JWT_TOKEN || 'abc');

  res.cookie('podwatch_jwt', token, {
    httpOnly: true,
    secure: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

}

/**
 * This middleware function will redirect the user to the login page if they are not authenticated. If they are authenticated, it will call next() and allow the request to continue. Note that if the route using this middleware is called by an AJAX request, the user will not be redirected. Instead, the request will fail with a 401 status code.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (req.user) {
  //   console.log('Authenticated user: ', req.user);
  //   return next();
  // }
  // res.status(401).redirect('/signin');

  const passportMiddleware = passport.authenticate('jwt', { session: false });
  return passportMiddleware(req, res, next);
};
