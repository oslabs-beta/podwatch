import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/UserModel';
import jwt from 'jsonwebtoken';
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
  const { email, password } = req.body; // Abc123
  if (!email || !password) {
    return next({
      log: 'Email or password missing from request body.',
      message: 'Invalid credentials',
      status: 403,
    });
  }

  try {
    console.log(`Searching for ${email} in the db`);
    const user = await UserModel.findOne({ email });

    console.log(`User ${user?.id} found.`);

    if (!user) {
      return next({
        log: 'Attempted sign in failed, no matching user in db',
        message: 'Invalid credentials',
        status: 403,
      });
    }

    console.log('Comparing password');
    const userAuthenticated = await user.comparePassword(password);
    if (!userAuthenticated) {
      return next({
        log: 'Attempted sign in failed, wrong password',
        message: 'Invalid credentials',
        status: 403,
      });
    }

    console.log('Assigning req.user');

    req.user = user;

    return next();
  } catch (error) {
    return next({
      log: 'Error occurred while attempting to sign in',
      message: 'Unexpected error occurred',
      status: 500,
      error,
    });
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
  console.log('Registering new user...');

  const { email, password } = req.body;
  if (!email || !password) {
    return next({
      log: 'Email or password missing from request body.',
      message: 'Invalid credentials',
      status: 403,
    });
  }

  // TODO: Validate email is in correct format and password is long enough with required characters

  // TODO: Check if email is already in use

  try {
    console.log(`Creating user ${email}`);

    const user = UserModel.build({
      email,
      password,
      provider: 'local',
    });

    await user.save();

    console.log('User created and saved');

    req.user = user;

    return next();
  } catch (error) {
    return next({
      error,
      log: 'An error occurred trying to create new user',
      message: 'User account creation failed',
      status: 500,
    });
  }
};

export const generateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserDocument;

  if (!user) {
    return next({
      log: 'No user on request object, cannot create JWT',
      message: 'You must log in to use this',
      status: 403,
    });
  }

  console.log(`Generating JWT for user ${user.email}`);

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.JWT_TOKEN || 'abc'
  );

  console.log(`Token generated: ${token}`);

  res.cookie('podwatch_jwt', token, {
    // httpOnly: true,
    // secure: true,
    signed: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  });

  console.log('Cookie assigned');

  return next();
};

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
  const passportMiddleware = passport.authenticate('jwt', { session: false });
  return passportMiddleware(req, res, next);
};
