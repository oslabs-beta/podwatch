import { JsonStreamParser } from './json-parser/JsonStreamParser';
import { EventDispatcher } from './dispatcher/EventDispatcher';
import { EventReceiver } from './receiver/EventReceiver';
import { EnvConfiguration } from './configuration/environment/EnvConfiguration';
import { Logger } from './logger/Logger';
import { KubernetesInstanceFactory } from './axios-instances/KubernetesInstanceFactory';
import { WebhookInstanceFactory } from './axios-instances/WebhookInstanceFactory';
import { Heartbeat } from './heartbeat/Heartbeat';

const logger = new Logger();

logger.info('Building environment configuration');
const config = new EnvConfiguration(
  {
    KUBERNETES_SERVICE_HOST: process.env.KUBERNETES_SERVICE_HOST,
    KUBERNETES_SERVICE_PORT: process.env.KUBERNETES_SERVICE_PORT,
    PODWATCH_CUSTOM_SERVER_URL: process.env.PODWATCH_CUSTOM_SERVER_URL,
    PODWATCH_CLIENT_ID: process.env.PODWATCH_CLIENT_ID,
    PODWATCH_CLIENT_SECRET: process.env.PODWATCH_CLIENT_SECRET,
    MAX_DISPATCH_QUEUE_SIZE: process.env.MAX_DISPATCH_QUEUE_SIZE || '20',
    DISPATCH_IDLE_TIMEOUT: process.env.DISPATCH_IDLE_TIMEOUT || '1000',
    WEBHOOK_INSTANCE_TIMEOUT: process.env.WEBHOOK_INSTANCE_TIMEOUT || '10000',
    PODWATCH_WEB_SERVICE_URL:
      process.env.PODWATCH_WEB_SERVICE_URL || 'https://api.podwatch.dev',
    HEARTBEAT_INTERVAL: process.env.HEARTBEAT_INTERVAL || '30000',
  },
  logger
);

logger.info('Validating environment configuration');
config.validate();

logger.info('Creating connection instance for cluster');
const kubernetesInstanceFactory = new KubernetesInstanceFactory(config, logger);
const kubernetesInstance = kubernetesInstanceFactory.create();

logger.info('Creating connection instance for webhook');
const webhookInstanceFactory = new WebhookInstanceFactory(config, logger);
const webhookInstance = webhookInstanceFactory.create();

logger.info('Creating heartbeat for service status reporting');
new Heartbeat(webhookInstance, config, logger);

logger.info('Instantiating JSON stream parser');
const jsonStreamParser = new JsonStreamParser();

logger.info('Instantiating event dispatcher');
const eventDispatcher = new EventDispatcher(webhookInstance, config, logger);

logger.info('Instantiating event receiver');
const receiver = new EventReceiver(
  kubernetesInstance,
  jsonStreamParser,
  eventDispatcher,
  logger
);

logger.info('Starting event receiver');
receiver.start();
