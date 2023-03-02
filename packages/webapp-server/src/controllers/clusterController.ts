import { Request, Response, NextFunction } from 'express';
import { ClusterModel, ClusterModel } from '../models/ClusterModel';
import { User } from '../models/UserModel';

export const createCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, secret, description, owner, members } = req.body;
    if (!name || !secret || !owner)
      throw new Error('Must provide name, secret, and owner');

    const newCluster = new ClusterModel({
      name,
      secret,
      description,
      owner,
      members,
    });
    await newCluster.save();
    res.locals.cluster = newCluster;
    return next();
  } catch (err) {
    return next(err);
  }
};

export const getAllClusters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as User;
    if (!user) throw new Error('Must be logged in to get clusters');
    const clusters = await ClusterModel.find({
      owner: {
        email: user.email,
        provider: user.provider,
      },
    }).exec();
    res.locals.allcluster = clusters;
    return next();
  } catch (err) {
    return next(err);
  }
};
