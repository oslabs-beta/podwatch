import { JsonStreamParser } from './json-parser/JsonStreamParser';
import { EventDispatcher } from './dispatcher/EventDispatcher';
import { EventReceiver } from './receiver/EventReceiver';
import { EnvConfiguration } from './configuration/environment/EnvConfiguration';
import { Logger } from './logger/Logger';
import { KubernetesInstanceFactory } from './axios-instances/KubernetesInstanceFactory';
import { WebhookInstanceFactory } from './axios-instances/WebhookInstanceFactory';
import dotenv from 'dotenv';
import { Heartbeat } from './heartbeat/Heartbeat';

dotenv.config();

const logger = new Logger();

logger.log('Building environment configuration');
const config = new EnvConfiguration(
  {
    KUBERNETES_SERVICE_HOST: process.env.KUBERNETES_SERVICE_HOST,
    KUBERNETES_SERVICE_PORT: process.env.KUBERNETES_SERVICE_PORT,
    PODWATCH_SERVICE_ACCOUNT_TOKEN: process.env.PODWATCH_SERVICE_ACCOUNT_TOKEN,
    PODWATCH_PORT: process.env.PODWATCH_PORT,
    PODWATCH_CUSTOM_SERVER_URL: process.env.PODWATCH_CUSTOM_SERVER_URL,
    PODWATCH_CLIENT_ID: process.env.PODWATCH_CLIENT_ID,
    PODWATCH_CLIENT_SECRET: process.env.PODWATCH_CLIENT_SECRET,
    MAX_DISPATCH_QUEUE_SIZE: process.env.MAX_DISPATCH_QUEUE_SIZE || '20',
    DISPATCH_IDLE_TIMEOUT: process.env.DISPATCH_IDLE_TIMEOUT || '1000',
    WEBHOOK_INSTANCE_TIMEOUT: process.env.WEBHOOK_INSTANCE_TIMEOUT || '10000',
    PODWATCH_WEB_SERVICE_URL:
      process.env.PODWATCH_WEB_SERVICE_URL ||
      'http://host.docker.internal:3001',
    EXTERNAL_KUBERNETES_PROXY_HOST:
      process.env.EXTERNAL_KUBERNETES_PROXY_HOST ||
      'http://host.docker.internal',
    HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL || '30000',
  },
  logger
);

logger.log('Validating environment configuration');
config.validate();

logger.log('Creating connection instance for cluster');
const kubernetesInstanceFactory = new KubernetesInstanceFactory(config, logger);
const kubernetesInstance = kubernetesInstanceFactory.create();

logger.log('Creating connection instance for webhook');
const webhookInstanceFactory = new WebhookInstanceFactory(config, logger);
const webhookInstance = webhookInstanceFactory.create();

logger.log('Creating heartbeat for service status reporting');
new Heartbeat(webhookInstance, config, logger);

logger.log('Instantiating JSON stream parser');
const jsonStreamParser = new JsonStreamParser();

logger.log('Instantiating event dispatcher');
const eventDispatcher = new EventDispatcher(webhookInstance, config, logger);

logger.log('Instantiating event receiver');
const receiver = new EventReceiver(
  kubernetesInstance,
  jsonStreamParser,
  eventDispatcher,
  logger
);

logger.log('Starting event receiver');
receiver.start();
