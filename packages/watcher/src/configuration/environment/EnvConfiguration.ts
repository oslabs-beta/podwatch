import Joi from 'joi';
import { Logger } from '../../logger/Logger';
import { Configuration } from '../Configuration';
import { InvalidEnvironmentException } from './InvalidEnvironmentException';
import envSchema, { EnvSchema } from './environment-schema';

export class EnvConfiguration extends Configuration<EnvSchema> {
  constructor(env: EnvSchema, logger: Logger) {
    super(env, envSchema, logger);
  }

  public get(key: keyof EnvSchema): string | undefined {
    if (!this.env[key]) {
      throw new Error(`Missing environment variable: ${String(key)}`);
    }
    return this.env[key];
  }

  public get isHostedInternally(): boolean {
    return this.env.KUBERNETES_SERVICE_HOST !== undefined;
  }

  public get isUsingCustomServer(): boolean {
    return this.env.PODWATCH_CUSTOM_SERVER_URL !== undefined;
  }

  protected override handleError(error: Joi.ValidationError) {
    error.details.forEach((error) => {
      this.logger.error(error.message);
    });

    throw new InvalidEnvironmentException(error.message);
  }
}
