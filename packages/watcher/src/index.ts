import { JsonStreamParser } from './JsonStreamParser';
import kubernetesInstance from './axios-kub';
import webhookInstance from './axios-webhook';
import { EventDispatcher } from './EventDispatcher';
import { KEventReceiver } from './EventReceiver';

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
