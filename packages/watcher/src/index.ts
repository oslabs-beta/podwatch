import { JsonStreamParser } from './JsonStreamParser';
import kubernetesInstance from './axios-kub';
import webhookInstance from './axios-webhook';
import eventDispatcher from './event-dispatcher';
import { KEventReceiver } from './EventReceiver';

console.log('Instantiating JSON stream parser');
const jsonStreamParser = new JsonStreamParser();

console.log('Instantiating event dispatcher');
const dispatch = eventDispatcher(webhookInstance);

console.log('Instantiating event receiver');
const receiver = new KEventReceiver(
  kubernetesInstance,
  jsonStreamParser,
  dispatch
);

console.log('Starting event receiver');
receiver.start();
