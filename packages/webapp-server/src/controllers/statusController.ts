import { NextFunction, Request, Response } from 'express';
import { Log, StatusModel } from '../models/StatusModel';

export const statusController = {
  /**
   * A middleware function to process a heartbeat from a cluster. Expects the cluster to have already been assigned to res.locals.cluster.
   */
  processHeartbeat: async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = res.locals.cluster.id;
    const { status, logs, timestamp } = req.body;

    console.log(`Received heartbeat from ${clusterId}: ${status}`);

    try {
      const statusUpdate = StatusModel.build({
        status,
        logs,
        timestamp,
        cluster: clusterId,
      });

      await statusUpdate.save();
    } catch (error) {
      return next({
        log: 'Error saving status',
        message: 'Error saving status',
        status: 500,
        error,
      });
    }
  },
  /**
   * A middleware function that returns the most recent status for a cluster. Expects the cluster to have already been assigned to res.locals.cluster.
   */
  getStatus: async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = res.locals.cluster.id;

    try {
      const status = (
        await StatusModel.find({ cluster: clusterId }, null, {
          sort: { timestamp: -1 },
          limit: 1,
        })
      )[0];

      if (!status) {
        return next({
          log: 'No status found',
          message: 'No status found',
          status: 404,
        });
      }

      const heartbeatInterval = Number(process.env.HEARTBEAT_INTERVAL) || 30000;

      // If it has been more than the interval plus 2 seconds since the last heartbeat, set status to OFFLINE in response
      if (status.timestamp < new Date(Date.now() - heartbeatInterval - 2000)) {
        status.status = 'OFFLINE';
      }

      res.locals.status = status;
      return next();
    } catch (error) {
      return next({
        log: 'Error getting status',
        message: 'Error getting status',
        status: 500,
        error,
      });
    }
  },
  /**
   * Returns the most recent logs for a cluster. Expects the cluster to have already been assigned to res.locals.cluster. Optional query parameters: limit, page
   */
  getStatusLogs: async (req: Request, res: Response, next: NextFunction) => {
    const clusterId = res.locals.cluster.id;
    const { limit, page } = req.query;

    const skip = (Number(page) || 0) * (Number(limit) || 100);

    try {
      const statusUpdates = await StatusModel.find(
        { cluster: clusterId },
        null,
        {
          sort: { timestamp: -1 },
          limit: Number(limit) || 100,
          skip,
        }
      );

      const logs = statusUpdates.reduce((acc: Log[], status) => {
        return acc.concat(status.logs);
      }, []);

      res.locals.logs = logs;
      return next();
    } catch (error) {
      return next({
        log: 'Error getting status logs',
        message: 'Error getting status logs',
        status: 500,
        error,
      });
    }
  },
};
