//check cluster notification settings
//confirm wheter or not the incoming event meets min requirments (like number of times)
//then call corresponding API
require('dotenv');
import { Request, Response, NextFunction } from 'express';
import { ClusterAttrs, ClusterModel } from '../models/ClusterModel';
import { KErrorModel, NativeKEvent } from '../models/KErrorModel';
import { User, UserDocument, UserModel } from '../models/UserModel';
import { Log, StatusModel } from '../models/StatusModel';
//const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = 'AC6abdad614f2d1cec57c365d1f018ae74';
//const authToken = process.env.TWILIO_TOKEN;
const authToken = '50ab23db6979e18ceac43df7fa477673';
const slackURL = process.env.SLACK_URL;
const nodemailer = require('nodemailer');
const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
//set up for texts
import twilio from 'twilio';
import { json } from 'stream/consumers';
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const WRITE = process.env.WRITE;

const client = twilio(accountSid, authToken);
//set up for slack bot
// Initializes  app with your bot token and signing secret
// const app = new App({
//   token: SLACK_BOT_TOKEN,
//   signingSecret: SLACK_SIGNING_SECRET,
//   socketMode: true,
//   appToken: WRITE,
// });

const web = new WebClient(SLACK_BOT_TOKEN);
const currentTime = new Date().toTimeString();

//to send emails need a transporter object
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//function for text messages
function sendText(toNumber: string, message: any) {
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber,
    })
    .then((message: any) => console.log(message.sid))
    .catch((error: Error) => console.log(error));
}
//for emails
function sendEmail(toEmail: string, message: any) {
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: toEmail,
      subject: 'Error in Kuberentes Pod',
      Text: message,
    },
    (err: Error, info: any) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Email send:' + info.response);
      }
    }
  );
}
//function for slack messages
function sendSlack(message: any) {}

export const sendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get all the clusters
  const clusters = res.locals.allClusters;
  console.log('clusters', clusters);
  //notificationAccess is assign the value of if that specific cluster has notifications on
  const notificationsEnabled = res.locals.cluster.notificationEnabled;
  //notificationType is assign the value of the clusters notification type (text,email,slack)
  const notificationType = res.locals.cluster.notificationType;
  //const notificationAccess is set to the means of accesss (phone number, email address, slack info)
  const notificationAccess = res.locals.cluster.notificationAccess;

  try {
    for (const cluster of clusters) {
      let id = cluster.id;
      const clusterError = await KErrorModel.findById(id);
      if (clusterError) {
        //this is the message for the Cluster
        const message = clusterError.message;
        console.log('message', message);
        if (notificationsEnabled === true && clusterError.count >= 5) {
          if (notificationType === 'text') {
            sendText(notificationAccess, message);
          } else if (notificationType === 'email') {
            sendEmail(notificationAccess, message);
          } else {
            (async () => {
              try {
                // Use the `chat.postMessage` method to send a message from this app
                await web.chat.postMessage({
                  channel: '#building-kubernetes-error-managment',
                  text: message,
                });
                console.log('Message posted!');
              } catch (error) {
                console.log(error);
              }
            })();
          }
        }
      }
      console.log('The message has been sent');
      return next();
    }
  } catch (error) {
    return next({
      log: 'Error getting status',
      message: 'Error getting status',
      status: 500,
      error,
    });
  }
};
