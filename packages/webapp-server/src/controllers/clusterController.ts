import { Request, Response, NextFunction } from 'express';
import { ClusterAttrs, ClusterModel } from '../models/ClusterModel';
import { User, UserDocument, UserModel } from '../models/UserModel';

//create a new cluster associated with use
export const createCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    if (!name) throw new Error('Must provide name');
    const user = req.user as UserDocument;
    if (!user)
      throw new Error('User must be logged in to create a new cluster');

    const secret = await ClusterModel.generateSecret();
    const clusterInfo: ClusterAttrs = {
      name,
      description,
      owner: user,
      secret,
      members: [],
    };
    const newCluster = await ClusterModel.build(clusterInfo);
    await newCluster.save();
    res.locals.newCluster = newCluster;
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
    const user = req.user as UserDocument;

    const clusters = await ClusterModel.find({
      owner: user.id,
    });
    res.locals.allClusters = clusters;
    return next();
  } catch (err) {
    return next({
      status: 400,
      message: 'Error getting all clusters',
      log: err,
    });
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

    const cluster: any = await ClusterModel.findById(id);
    if (!cluster) throw new Error('No cluster matching that id');
    const searchUser: any = await UserModel.findById(cluster.owner.valueOf());
    if (searchUser == user)
      throw new Error("This cluster doesn't belong to this user");
    res.locals.getCluster = cluster;
    return next();
  } catch (err) {
    return next({
      status: 400,
      message: 'Error getting cluster',
      log: err,
    });
  }
};

//cluster/:id update cluster with given id
export const updateCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //get the id from the url
    const { id } = req.params;
    //if no id provided
    console.log('in update');
    if (!id) {
      throw new Error('Must provide cluster id');
    }
    const newData = req.body.name;
    //get the specific user from the request
    const user = req.user as User;
    if (!user) {
      throw new Error('Must be logged in to update cluster');
    }
    const cluster: any = await ClusterModel.findById(id);
    if (!cluster) throw new Error('No cluster matching that id');
    const searchUser: any = await UserModel.findById(cluster.owner.valueOf());
    if (searchUser == user)
      throw new Error("This cluster doesn't belong to this user");

    ClusterModel.findByIdAndUpdate(id, { name: newData }, { new: true })
      .then((updatedCluster) => {
        console.log('updatedCluster', updatedCluster);
        console.log('cluster has been updated');
        return next();
      })
      .catch((err) => {
        console.error(err);
      });

    // console.log('updatedClusters', updatedClusters);
    // res.locals.getCluster = updatedClusters;
    // return next();
  } catch (err) {
    return next(err);
  }
};

//cluster/:id delete cluster  with given id
export const deleteCluster = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    ClusterModel.findByIdAndDelete(id, (err: Error, result: Object): void => {
      if (err) {
        console.log(err);
      } else {
        console.log('cluster has been deleted');
        return next();
      }
    });
  } catch (err) {
    return next(err);
  }
};
