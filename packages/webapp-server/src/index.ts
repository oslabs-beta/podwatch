import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { setupPassport } from './controllers/passportProvider';

import watcherRouter from './routers/watcherRouter';
import kErrorRouter from './routers/kErrorRouter';
import authRouter from './routers/authRouter';

import { errorHandler } from './errors/errorHandler';
//import clusterRouter
import clusterRouter from './routers/clusterRouter';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//routers
app.use('/watch', watcherRouter);
app.use('/kerrors', kErrorRouter);
app.use('/auth', authRouter);
app.use('/cluster', clusterRouter);

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

  app.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

start();
