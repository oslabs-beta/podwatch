//check cluster notification settings
//confirm wheter or not the incoming event meets min requirments (like number of times)
//then call corresponding API

import { Request, Response, NextFunction } from 'express';
import { ClusterAttrs, ClusterModel } from '../models/ClusterModel';
import { KErrorModel, NativeKEvent } from '../models/KErrorModel';
import { User, UserDocument, UserModel } from '../models/UserModel';
import { Log, StatusModel } from '../models/StatusModel';
//const accountSid = process.env.TWILIO_ACCOUNT_SID;
const accountSid = 'AC6abdad614f2d1cec57c365d1f018ae74';
//const authToken = process.env.TWILIO_TOKEN;
const authToken = '091f2b87d26122c04beb10b258d153f6';
//const slackURL = process.env.SLACK_URL;

const nodemailer = require('nodemailer');
const { App } = require('@slack/bolt');
const { WebClient } = require('@slack/web-api');
//set up for texts
import twilio from 'twilio';
import { json } from 'stream/consumers';
import { forEachChild, idText } from 'typescript';
import { send } from 'process';
//const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_BOT_TOKEN =
  'xoxb-5148669881568-5148690677904-qujxIPUr9fMgKy448EcVspJG';
//const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;
const SLACK_SIGNING_SECRET = 'e12538bacc9650ac5a7042cd5a166e03';
//const WRITE = process.env.WRITE;
const WRITE =
  'xapp-1-A053GBH4SRL-5161408436352-579b7e9e58856a48c32ba7676d3e8a38c0a30eb14f1f9e0afe02b221f31fb885';

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
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'podwatchnoerrors1@gmail.com',
//     pass: 'codesmith',
//   },
// });
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'podwatchnoerrors1@gmail.com',
    pass: 'codesmith',
  },
});

//function for text messages
function sendText(toNumber: string, message: any) {
  client.messages
    .create({
      body: message,
      from: '+18449771565',
      to: toNumber,
    })
    .then((message: any) => console.log('TEXT MESSAGE', message.sid))
    .catch((error: Error) => console.log(error));
}
//for emails
function sendEmail(toEmail: string, message: any) {
  transporter.sendMail(
    {
      from: '"PodWatch"<podwatchnoerrors1@gmail.com>',
      to: 'kmcromer1@gmail.com',
      subject: 'Error in Kuberentes Pod',
      text: message,
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

export const sendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //get all the clusters
  const clusters = res.locals.allClusters;
  console.log('clusters', clusters);

  try {
    for (const cluster of clusters) {
      console.log('clusters[i]:', cluster);
      //notificationAccess is assign the value of if that specific cluster has notifications on
      const notificationsEnabled = cluster.notificationEnabled;
      console.log('NOTIFEN:', notificationsEnabled);
      //notificationType is assign the value of the clusters notification type (text,email,slack)
      const notificationType = cluster.notificationType;
      console.log('NOTTYPE', notificationType);
      //const notificationAccess is set to the means of accesss (phone number, email address, slack info)
      const notificationAccess = cluster.notificationAccess;

      let id = cluster.id;
      const clusterError = await KErrorModel.find({ cluster: id });
      console.log('clusterError', clusterError);
      if (clusterError[0]) {
        //this is the message for the Cluster
        for (const error of clusterError) {
          const message = error.message;
          console.log('message', message);
          if (notificationsEnabled === true && error.count >= 5) {
            if (notificationType === 'text') {
              sendText(notificationAccess, message);
              console.log('TEXT WAS TRIGGERED');
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
      } else {
        if (notificationType === 'text') {
          console.log('MADE IT TO NON ERRORS TEXT MESSAGES');
          let message = 'all good';
          sendText(notificationAccess, message);
          console.log('TEXT WAS TRIGGERED');
        } else if (notificationType === 'email') {
          console.log('MADE IT TO EMAIL');

          const sgMail = require('@sendgrid/mail');
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          const msg = {
            to: 'kmcromer1@example.com', // Change to your recipient
            from: 'podwatchnoerrors1@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
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
      }
      console.log('The message has been sent');
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
