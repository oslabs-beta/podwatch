import { JsonStreamParser } from './JsonStreamParser';
import kubernetesInstance from './axios-kub';
import webhookInstance from './axios-webhook';
import { EventDispatcher } from './EventDispatcher';
import { KEventReceiver } from './EventReceiver';
import { EnvConfiguration } from './configuration/EnvConfiguration';

const configuration = new EnvConfiguration({
  KUBERNETES_SERVICE_HOST: process.env.KUBERNETES_SERVICE_HOST,
  KUBERNETES_SERVICE_PORT: process.env.KUBERNETES_SERVICE_PORT,
  PODWATCH_SERVICE_ACCOUNT_TOKEN: process.env.PODWATCH_SERVICE_ACCOUNT_TOKEN,
  PODWATCH_PORT: process.env.PODWATCH_PORT,
  PODWATCH_CUSTOM_SERVER_URL: process.env.PODWATCH_CUSTOM_SERVER_URL,
  PODWATCH_CLIENT_ID: process.env.PODWATCH_CLIENT_ID,
  PODWATCH_CLIENT_SECRET: process.env.PODWATCH_CLIENT_SECRET,
});

console.log('Instantiating JSON stream parser');
const jsonStreamParser = new JsonStreamParser();

console.log('Instantiating event dispatcher');
const eventDispatcher = new EventDispatcher(webhookInstance);

console.log('Instantiating event receiver');
const receiver = new KEventReceiver(
  kubernetesInstance,
  jsonStreamParser,
  eventDispatcher
);

console.log('Starting event receiver');
receiver.start();
