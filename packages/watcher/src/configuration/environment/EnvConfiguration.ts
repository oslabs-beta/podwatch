import Joi from 'joi';
import { Logger } from '../../logger/Logger';
import { Configuration } from '../Configuration';
import { InvalidEnvironmentException } from './InvalidEnvironmentException';
import envSchema, { EnvSchema } from './schema';

/**
 * A concrete class to manage the application configuration provided by environment variables.
 */
export class EnvConfiguration extends Configuration<EnvSchema> {
  constructor(env: EnvSchema, logger: Logger) {
    super(env, envSchema, logger);
  }

  /**
   * Returns the value of the environment variable with the provided key.
   * @param key The key of the environment variable to get.
   * @returns
   */
  public get(key: keyof EnvSchema): string | undefined {
    if (!this.env[key]) {
      throw new Error(`Missing environment variable: ${String(key)}`);
    }
    return this.env[key];
  }

  /**
   * Returns a boolean indicating whether the application is using a custom server.
   */
  public get isUsingCustomServer(): boolean {
    return this.env.PODWATCH_CUSTOM_SERVER_URL !== undefined;
  }

  /**
   * Logs the configuration error before rethrowing a new InvalidEnvironmentException.
   * @param error A Joi error.
   * @throws InvalidEnvironmentException
   */
  protected override handleError(error: Joi.ValidationError) {
    error.details.forEach((error) => {
      this.logger.error(error.message);
    });

    throw new InvalidEnvironmentException(error.message);
  }
}
