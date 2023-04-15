//check cluster notification settings
//confirm wheter or not the incoming event meets min requirments (like number of times)
//then call corresponding API
import { Request, Response, NextFunction } from 'express';
import { ClusterAttrs, ClusterModel } from '../models/ClusterModel';
import { KErrorModel, NativeKEvent } from '../models/KErrorModel';
import { User, UserDocument, UserModel } from '../models/UserModel';
import { Log, StatusModel } from '../models/StatusModel';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_TOKEN;

require('dotenv');

//for texts
import { Twilio } from 'twilio';

const client = require('twilio')(accountSid, authToken);
//cluder/:id get cluster with given id

//clusters with text notificaitons
const textClusters: Array<any> = [];
const emailClusters: Array<any> = [];
const slackClusters: Array<any> = [];

//for text messages
function sendText(toNumber: string, message: any) {
  client.message
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber,
    })
    .then((message: any) => console.log(message.sid))
    .catch((error: Error) => console.log(error));
}

//notificaiton controller
export const sendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clusterId = res.locals.cluster.id;
  console.log('clusterId', clusterId);
  //notificationAccess is assign the value of if that specific cluster has notifications on
  const notificationsEnabled = res.locals.cluster.notificationEnabled;
  //notificationType is assign the value of the clusters notification type (text,email,slack)
  const notificationType = res.locals.cluster.notificationType;
  //const notificationAccess is set to the means of accesss (phone number, email address, slack info)
  const notificationAccess = res.locals.cluster.notificationAccess;

  try {
    //get the status of the cluster
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
    //this is what the cluster error is and will be sent to the user
    const message = status.logs[0].message;

    //work on the time interval in a moment

    //check to ensure the the cluster has notifications enabled
    if (notificationsEnabled === true) {
      //if they do check the way that the user would like to be notified
      if (notificationType === 'text') {
        setInterval(() => {
          sendText(notificationAccess, message);
        }, 5 * 60 * 1000);
      } else if (notificationType === 'email') {
        return 'working on sending emails';
      } else {
        return 'working on sending slack';
      }
    }

    console.log('The message has been sent');
    return next();
  } catch (error) {
    return next({
      log: 'Error getting status',
      message: 'Error getting status',
      status: 500,
      error,
    });
  }
};

////old material when id was in params
//const { id } = req.params;

//const user = req.user as UserDocument;

//const cluster = await ClusterModel.findById(id);

// if (!cluster) {
//   return res.status(404).json({ message: 'Cluster not found' });
// }
//     //get phone number
//     const { notificationAccess } = cluster;
//     const message = `There is a __ error __ in cluster ${cluster.name}.`;
//     sendText(notificationAccess, message);
//     // clusters.forEach((cluster) => {
//     //   if (cluster.notificationType === 'text') {
//     //     textClusters.push(cluster);
//     //   } else if (cluster.notificationType === 'email') {
//     //     emailClusters.push(cluster);
//     //   } else if (cluster.notificationType === 'slack') {
//     //     slackClusters.push(cluster);
//     //   }
//     // });
//     console.log('The message has been sent');
//     return next();
//   } catch (err) {
//     return next({
//       status: 400,
//       message: 'Error getting cluster and sending message',
//       log: err,
//     });
//   }
// };

// textClusters.forEach((textCluster: any) => {
//   client.message.create({
//     body: 'Sample Error Message',
//     to: textCluster.notificationAccess,
//     from: process.env.TWILIO_PHONE_NUMBER,
//   });
// });
