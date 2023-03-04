import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { watcherRouter } from './routers/watcherRouter';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/watch', watcherRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('Error connecting to MongoDB');
    console.error(err);
  }

  app.listen(3001, () => {
    console.log('Listening on port 3001');
  });
};

start();
