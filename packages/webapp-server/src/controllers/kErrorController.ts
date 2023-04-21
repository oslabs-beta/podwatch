import { NextFunction, Request, Response } from 'express';
import { ClusterModel } from '../models/ClusterModel';
import { KErrorModel, NativeKEvent } from '../models/KErrorModel';
import { UserDocument } from '../models/UserModel';

export interface KErr {
  name: string;
  reason: string;
  message: string;
  type: string;
  firstTimestamp: string;
  lastTimestamp: string;
  count: number;
  nativeEvent: NativeKEvent;
}

export const kErrorController = {
  getClusterFromHeaders: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const clusterId = req.get('Cluster-ID') as string;
    const clusterSecret = req.get('Cluster-Secret') as string;

    if (!clusterId || !clusterSecret) {
      return next({
        log: `Missing clusterId or clusterSecret in request headers: ${JSON.stringify(
          req.headers
        )}`,
        message: 'Missing clusterId or clusterSecret in request headers',
        status: 400,
      });
    }

    const cluster = await ClusterModel.findById(clusterId);
    if (!cluster) {
      return next({
        log: 'Cluster not found',
        message: 'Cluster not found',
        status: 404,
      });
    }

    const authenticated = await cluster.compareSecret(clusterSecret);
    if (!authenticated) {
      return next({
        log: `Cluster secret does not match: ${authenticated}`,
        message: 'Cluster secret does not match',
        status: 401,
      });
    }

    res.locals.cluster = cluster;
    return next();
  },
  getClusterFromParams: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { clusterId } = req.params;
    const user = req.user as UserDocument;

    if (!clusterId) {
      return next({
        log:
          'Missing clusterId in request params. Got: ' +
          JSON.stringify(req.params),
        message: 'Missing clusterId in request params',
        status: 400,
      });
    }
    try {
      const cluster = await ClusterModel.findById(clusterId).populate('owner');
      if (!cluster) {
        return next({
          log: 'Cluster not found',
          message: 'Cluster not found',
          status: 404,
        });
      }

      if (
        cluster.owner.id !== user.id &&
        !cluster.members.some((member) => member.id === user.id)
      ) {
        return next({
          log: 'User does not have access to cluster',
          message: 'Access denied',
          status: 403,
        });
      }

      res.locals.cluster = cluster;
      return next();
    } catch (error) {
      return next({
        log: 'Error getting cluster',
        message: 'Error getting cluster',
        status: 500,
        error,
      });
    }
  },
  saveAll: async (req: Request, res: Response, next: NextFunction) => {
    const kErrors: KErr[] = req.body;
    const cluster = res.locals.cluster;

    const saveError = async (kError: KErr) => {
      const { firstTimestamp, lastTimestamp } = kError;
      const kErrorModel = KErrorModel.build({
        ...kError,
        firstTimestamp: new Date(firstTimestamp),
        lastTimestamp: new Date(lastTimestamp),
        cluster,
      });
      await kErrorModel.save();
    };

    try {
      const errorPromises = kErrors.map(saveError);
      await Promise.all(errorPromises);

      return next();
    } catch (error) {
      return next({
        log: 'Error saving kErrors',
        message: 'Error saving kErrors',
        status: 500,
        error,
      });
    }
  },
  getMany: async (req: Request, res: Response, next: NextFunction) => {
    const cluster = res.locals.cluster;

    const limit = Number(req.query.limit) || 50;
    const skip = Number(req.query.skip) || 0;

    try {
      const kErrors = await KErrorModel.find({ cluster: cluster.id }, null, {
        sort: { lastTimestamp: -1 },
        limit,
        skip,
      });
      console.log('kERROS', kErrors);

      res.locals.kErrors = kErrors;

      return next();
    } catch (error) {
      return next({
        log: 'Error getting kErrors',
        message: 'Error getting kErrors',
        status: 500,
        error,
      });
    }
  },
  getOne: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const kError = await KErrorModel.findById(id);
      console.log('kERROR', kError);
      if (!kError) {
        return next({
          log: 'kError not found',
          message: 'kError not found',
          status: 404,
        });
      }

      res.locals.kError = kError;

      return next();
    } catch (error) {
      return next({
        log: 'Error getting kError',
        message: 'Error getting kError',
        status: 500,
        error,
      });
    }
  },
};
