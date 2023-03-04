import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { setupPassport } from './controllers/passportProvider';
import authRouter from './routes/authRouter';

import watcherRouter from './routers/watcherRouter';
import kErrorRouter from './routers/kErrorRouter';

import { errorHandler } from './errors/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/watch', watcherRouter);
app.use('/kerrors', kErrorRouter);
app.use('/auth', authRouter);

app.use(errorHandler);

app.use('/watch', watcherRouter);
app.use('/kerrors', kErrorRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB');
    console.error(err);
  }

  setupPassport(app);

  //use the auth router for any calls to the /auth route
  app.use('/auth', authRouter);

  app.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

start();
