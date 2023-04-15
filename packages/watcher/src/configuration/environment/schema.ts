import Joi from 'joi';

/**
 * A type to represent the application environment variables.
 */
export interface EnvSchema {
  /**
   * The host of the Kubernetes API when the service is hosted inside the cluster. This is automatically set by Kubernetes.
   */
  KUBERNETES_SERVICE_HOST: string | undefined;

  /**
   * The port of the Kubernetes API when the service is hosted inside the cluster. This is automatically set by Kubernetes.
   */
  KUBERNETES_SERVICE_PORT: string | undefined;

  /**
   * The URL of a custom Podwatch server to use instead of the Podwatch Web Service. This will dispatch events to the custom server instead of the Podwatch Web Service.
   */
  PODWATCH_CUSTOM_SERVER_URL: string | undefined;

  /**
   * The client ID used to identify the cluster with the Podwatch Web Service.
   */
  PODWATCH_CLIENT_ID: string | undefined;

  /**
   * The client secret used to authenticate with the Podwatch Web Service.
   */
  PODWATCH_CLIENT_SECRET: string | undefined;

  /**
   * The maximum number of events to dispatch at once.
   * @default 20
   */
  MAX_DISPATCH_QUEUE_SIZE: string | undefined;

  /**
   * The amount of time to wait before dispatching events.
   * @default 1000
   */
  DISPATCH_IDLE_TIMEOUT: string | undefined;

  /**
   * The amount of time to wait before timing out a webhook instance. The dispatcher will give up on a webhook instance after this amount of time.
   * @default 10000
   */
  WEBHOOK_INSTANCE_TIMEOUT: string | undefined;

  /**
   * The URL of the Podwatch Web Service. Not meant to be set by the user. To set a custom URL for dispatching events, use PODWATCH_CUSTOM_SERVER_URL.
   */
  PODWATCH_WEB_SERVICE_URL: string | undefined;

  /**
   * The interval at which the service will send a heartbeat to the Podwatch Web Service, in milliseconds.
   * @default 30000
   */
  HEARTBEAT_INTERVAL: string | undefined;
}

/**
 * The schema for the application environment variables.
 */
const envSchema = Joi.object({
  KUBERNETES_SERVICE_HOST: Joi.string().optional(),
  KUBERNETES_SERVICE_PORT: Joi.string().optional(),
  PODWATCH_CUSTOM_SERVER_URL: Joi.string().optional(),
  PODWATCH_CLIENT_ID: Joi.string().when('PODWATCH_CUSTOM_SERVER_URL', {
    is: Joi.exist(),
    then: Joi.optional().empty().warning('custom.server', {}).messages({
      'custom.server':
        'The use of a custom server negates the need for a PODWATCH_CLIENT_ID environment variable. If you instead meant to use the Podwatch Web Service, please unset the PODWATCH_CUSTOM_SERVER_URL environment variable.',
    }),
    otherwise: Joi.required().messages({
      'any.only': 'Please set the PODWATCH_CLIENT_ID environment variable.',
    }),
  }),
  PODWATCH_CLIENT_SECRET: Joi.string().when('PODWATCH_CUSTOM_SERVER_URL', {
    is: Joi.exist(),
    then: Joi.optional().empty().warning('custom.server', {}).messages({
      'custom.server':
        'The use of a custom server negates the need for a PODWATCH_CLIENT_SECRET environment variable. If you instead meant to use the Podwatch Web Service, please unset the PODWATCH_CUSTOM_SERVER_URL environment variable.',
    }),
    otherwise: Joi.required().messages({
      'any.only': 'Please set the PODWATCH_CLIENT_SECRET environment variable.',
    }),
  }),
  MAX_DISPATCH_QUEUE_SIZE: Joi.string()
    .required()
    .regex(/^-?\d+$/),
  DISPATCH_IDLE_TIMEOUT: Joi.string()
    .regex(/^-?\d+$/)
    .required(),
  WEBHOOK_INSTANCE_TIMEOUT: Joi.string()
    .regex(/^-?\d+$/)
    .required(),
  PODWATCH_WEB_SERVICE_URL: Joi.string().required(),
  HEARTBEAT_INTERVAL: Joi.string()
    .required()
    .regex(/^-?\d+$/),
})
  .and('KUBERNETES_SERVICE_HOST', 'KUBERNETES_SERVICE_PORT')
  .and('PODWATCH_CLIENT_ID', 'PODWATCH_CLIENT_SECRET');

export default envSchema;
