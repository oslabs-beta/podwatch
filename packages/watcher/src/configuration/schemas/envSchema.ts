import Joi from 'joi';

export interface EnvSchema {
  PODWATCH_SERVICE_ACCOUNT_TOKEN: string | undefined;
  PODWATCH_PORT: string | undefined;
  KUBERNETES_SERVICE_HOST: string | undefined;
  KUBERNETES_SERVICE_PORT: string | undefined;
  PODWATCH_CUSTOM_SERVER_URL: string | undefined;
  PODWATCH_CLIENT_ID: string | undefined;
  PODWATCH_CLIENT_SECRET: string | undefined;
}

const envSchema = Joi.object({
  PODWATCH_SERVICE_ACCOUNT_TOKEN: Joi.string().when('KUBERNETES_SERVICE_HOST', {
    is: Joi.not(undefined),
    then: Joi.optional()
      .allow(undefined)

      .message(
        'Environment variable PODWATCH_SERVICE_ACCOUNT_TOKEN is not required when running inside the cluster'
      )
      .warn(),
    otherwise: Joi.required().message(
      'Environment variable PODWATCH_SERVICE_ACCOUNT_TOKEN is required when running outside the cluster.'
    ),
  }),
  PODWATCH_PORT: Joi.string().when('KUBERNETES_SERVICE_HOST', {
    is: Joi.not(undefined),
    then: Joi.optional()
      .allow(undefined)
      .message(
        'Environment variable PODWATCH_SERVICE_ACCOUNT_TOKEN is not required when running inside the cluster'
      )
      .warn(),
    otherwise: Joi.required().message(
      'Environment variable PODWATCH_SERVICE_ACCOUNT_TOKEN is required when running outside the cluster.'
    ),
  }),
  KUBERNETES_SERVICE_HOST: Joi.string().optional(),
  KUBERNETES_SERVICE_PORT: Joi.string().optional(),
  PODWATCH_CUSTOM_SERVER_URL: Joi.string()
    .when('PODWATCH_CLIENT_ID', {
      is: Joi.not(undefined),
      then: Joi.optional()
        .allow(undefined)
        .message(
          'The use of a custom server negates the need for a PODWATCH_CLIENT_ID environment variable. If you instead meant to use the Podwatch Web Service, please unset the PODWATCH_CUSTOM_SERVER_URL environment variable.'
        )
        .warn(),
      otherwise: Joi.required(),
    })
    .when('PODWATCH_CLIENT_SECRET', {
      is: Joi.not(undefined),
      then: Joi.optional()
        .allow(undefined)
        .message(
          'The use of a custom server negates the need for a PODWATCH_CLIENT_SECRET environment variable. If you instead meant to use the Podwatch Web Service, please unset the PODWATCH_CUSTOM_SERVER_URL environment variable.'
        )
        .warn(),
      otherwise: Joi.required(),
    }),
  PODWATCH_CLIENT_ID: Joi.string().when('PODWATCH_CUSTOM_SERVER_URL', {
    is: Joi.not(undefined),
    then: Joi.optional(),
    otherwise: Joi.required().message(
      'Please set the PODWATCH_CLIENT_ID environment variable.'
    ),
  }),
  PODWATCH_CLIENT_SECRET: Joi.string().when('PODWATCH_CUSTOM_SERVER_URL', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required().message(
      'Please set the PODWATCH_CLIENT_SECRET environment variable.'
    ),
  }),
});

export default envSchema;
