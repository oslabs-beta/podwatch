import { Request, Response, NextFunction } from 'express';
import { ClusterModel, ClusterModel } from '../models/ClusterModel';
import { User } from '../models/UserModel';

//create a new cluster associated with use
export const createCluster = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, owner, members } = req.body;
    if (!name || !owner) throw new Error('Must provide name and owner');
    const user = req.user as User;
    if (!user)
      throw new Error('User must be logged in to create a new cluster');

    const newCluster = ClusterModel.build;
    const secret = ClusterModel.generateSecret;
    newCluster.secret = secret;
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
    const user = req.user as User;
    if (!user) throw new Error('Must be logged in to get clusters');
    const clusters = await ClusterModel.find({
      owner: {
        email: user.email,
        provider: user.provider,
      },
    }).exec();
    res.locals.allClusters = clusters;
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
    } else {
      res.locals.getCluster = cluster;
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
  try {
    //get the id from the url
    const { id } = req.params;
    //if no id provided
    if (!id) {
      throw new Error('Must provide cluster id');
    }
    //get the specific user from the request
    const user = req.user as User;
    if (!user) {
      throw new Error('Must be logged in to update cluster');
    }
    ClusterModel.findByIdAndUpdate(
      id,
      {
        owner: {
          email: user.email,
          provider: user.provider,
        },
      },
      function (err: Error, docs: object): void {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated Cluster: ', docs);
        }
      }
    );
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
      }
    });
  } catch (err) {
    return next(err);
  }
};
