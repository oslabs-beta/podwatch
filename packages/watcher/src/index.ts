import { JsonStreamParser } from './json-parser/JsonStreamParser';
import { EventDispatcher } from './dispatcher/EventDispatcher';
import { EventReceiver } from './receiver/EventReceiver';
import { EnvConfiguration } from './configuration/environment/EnvConfiguration';
import { Logger } from './logger/Logger';
import { KubernetesInstanceFactory } from './axios-instances/KubernetesInstanceFactory';
import { WebhookInstanceFactory } from './axios-instances/WebhookInstanceFactory';

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
  },
  logger
);

logger.log('Creating connection instance for cluster');
const kubernetesInstanceFactory = new KubernetesInstanceFactory(config, logger);
const kubernetesInstance = kubernetesInstanceFactory.create();

logger.log('Create connection instance for webhook');
const webhookInstanceFactory = new WebhookInstanceFactory(config, logger);
const webhookInstance = webhookInstanceFactory.create();

logger.log('Instantiating JSON stream parser');
const jsonStreamParser = new JsonStreamParser();

logger.log('Instantiating event dispatcher');
const eventDispatcher = new EventDispatcher(webhookInstance);

logger.log('Instantiating event receiver');
const receiver = new EventReceiver(
  kubernetesInstance,
  jsonStreamParser,
  eventDispatcher
);

logger.log('Starting event receiver');
receiver.start();
