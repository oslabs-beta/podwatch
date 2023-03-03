import { JsonStreamParser } from './_JsonStreamParser';
import kubernetesInstance from './axios-kub';
import webhookInstance from './axios-webhook';
import eventDispatcher from './event-dispatcher';
import { KEventReceiver } from './EventReceiver';

const jsonStreamParser = new JsonStreamParser();

const dispatch = eventDispatcher(webhookInstance);

const receiver = new KEventReceiver(
  kubernetesInstance,
  jsonStreamParser,
  dispatch
);

receiver.start();
