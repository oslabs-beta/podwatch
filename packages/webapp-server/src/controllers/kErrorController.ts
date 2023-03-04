import { NextFunction, Request, Response } from 'express';
import { ClusterModel } from '../models/ClusterModel';
import { NativeKEvent, KErrorModel } from '../models/KErrorModel';

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
  saveAll: async (req: Request, res: Response, next: NextFunction) => {
    const kErrors: KErr[] = req.body;
    const clusterId = req.headers['clientId'] as string;
    const clusterSecret = req.headers['clientSecret'] as string;

    if (!clusterId || !clusterSecret) {
      return next({
        log: 'Missing clusterId or clusterSecret in request headers',
        message: 'Missing clusterId or clusterSecret in request headers',
        status: 400,
      });
    }

    const cluster = await ClusterModel.findOne({ clusterId });
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
        log: 'Cluster secret does not match',
        message: 'Cluster secret does not match',
        status: 401,
      });
    }

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
};
