import { Request, Response, NextFunction } from 'express';
import { ClusterModel } from '../models/ClusterModel';
import { User } from '../models/UserModel';

//create a new cluster associated with use
export const createCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, secret, description, owner, members } = req.body;
    if (!name || !secret || !owner)
      throw new Error('Must provide name, secret, and owner');
    const user = req.user as User;
    if (!user)
      throw new Error('User must be logged in to create a new cluster');

    const newCluster = new ClusterModel({
      name,
      secret,
      description,
      owner: {
        email: user.email,
        provider: user.provider,
      },
      members: [
        {
          email: user.email,
          provider: user.provider,
        },
      ],
    });
    await newCluster.save();
    res.locals.cluster = newCluster;
    return next();
  } catch (err) {
    return next(err);
  }
};

//get all clusters associated with user
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

//cluder/:id get cluster with given id

export const getCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error('Must provide cluster id');
    }
    const user = req.user as User;
    if (!user) {
      throw new Error('Please log in to get cluster info');
    }
    const cluster = await ClusterModel.findById(id);

    if (!cluster) {
      throw new Error('No cluster matching that id');
    }
    if (
      cluster.owner.email !== user.email &&
      cluster.owner.provider !== user.provider
    ) {
      throw new Error("This cluster doesn't belong to this user");
    }
  } catch (err) {
    return next(err);
  }
};

//cluster/:id update cluster with given id
export const updateCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  if (!id) {
    throw new Error('Must provide cluster id');
  }
  const user = req.user as User;
};

//cluster/:id delete cluster  with given id
