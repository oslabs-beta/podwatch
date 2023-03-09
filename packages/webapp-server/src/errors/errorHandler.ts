import { NextFunction, Request, Response } from 'express';

/**
 * An error that should be passed to the next() function when an error occurs
 */
export interface AppError {
  /**
   * A log message to be printed to the console (server side only)
   */
  log: string;
  /**
   * A message to be sent to the client
   */
  message: string;
  /**
   * The HTTP status code to be sent to the client
   */
  status: number;
  /**
   * An optional error object to be printed to the console (server side only)
   */
  error?: any;
}

const defaultError = {
  log: 'An error unhandled by the server occurred',
  message: 'An unexpected error occurred',
  status: 500,
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorObj = { ...defaultError, ...err };
  console.log(errorObj.log);
  if (errorObj.error) {
    console.error(errorObj.error);
  }
  return res.status(errorObj.status).json(errorObj.message);
};
