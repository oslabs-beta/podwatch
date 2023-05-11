//check cluster notification settings
//confirm wheter or not the incoming event meets min requirments (like number of times)
//then call corresponding API
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { KErrorModel, NativeKEvent } from '../models/KErrorModel';
import process from 'process';
import { WebClient } from '@slack/web-api';
import twilio, { Twilio } from 'twilio';

let client: Twilio;
let web: WebClient;

export const setupTwilio = () => {
  //slack downloads
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_TOKEN;

  //set up for slack bot
  const botToken = process.env.SLACK_BOT_TOKEN;
  web = new WebClient(botToken);
  client = twilio(accountSid, authToken);
};

dotenv.config();

//function for text messages
async function sendText(toNumber: string, message: string, name: string) {
  try {
    await client.messages.create({
      body: `The cluster: ${name} is experiencing the error: ${message}`,
      from: process.env.TWILIO_PHONE,
      to: toNumber,
    });
    console.log('TEXT MESSAGE', message);
  } catch (error) {
    console.log(error);
  }
}
//for emails
function sendEmail(toEmail: string, message: string, name: string) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.PODWATCH_EMAIL);
  const msg = {
    to: toEmail, // Change to your recipient
    from: process.env.EMAIL, // Change to your verified sender
    subject: 'Cluster Error',
    text: `The cluster: ${name} is experiencing the error: ${message}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error: any) => {
      console.error(error);
    });
}
//for slack
function sendSlack(conversationId: string, message: string, name: string) {
  const result = web.chat.postMessage({
    text: `The cluster: ${name} is experiencing the error: ${message}`,
    blocks: [],
    channel: conversationId,
  });
}
export const sendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get all the clusters
  //const clustersAll = res.locals.allClusters;
  const cluster = res.locals.cluster;
  try {
    //notificationAccess is assign the value of if that specific cluster has notifications on
    const notificationsEnabled = cluster.notificationEnabled;
    //notificationType is assign the value of the clusters notification type (text,email,slack)
    const notificationType = cluster.notificationType;
    //const notificationAccess is set to the means of accesss (phone number, email address, slack info)
    const notificationAccess = cluster.notificationAccess;
    //grab the name of the cluster
    const name = cluster.name;
    const clusterError = await KErrorModel.find({ cluster: cluster.id });
    //check if a error does exist in the cluster
    if (clusterError[0]) {
      //for each error associated with the cluster
      for (const error of clusterError) {
        //the user readable message regarding the error
        const message = error.message;
        //if the cluster notificaitons have been enabled adn the error count is greater or equal to 5
        if (notificationsEnabled === true && error.count >= 5) {
          //if the notificationType is text
          if (notificationType === 'text') {
            await sendText(notificationAccess, message, name);
            //reset the error count to 0
            error.count = 0;
          }
          //if the notificationType is email
          else if (notificationType === 'email') {
            await sendEmail(notificationAccess, message, name);
            //rest the error count to 0
            error.count = 0;
          } else {
            await sendSlack(notificationAccess, message, name);
            error.count = 0;
          }
        }
      }
    }
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
