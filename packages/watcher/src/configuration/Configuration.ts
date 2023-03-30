import Joi from 'joi';
import { Logger } from '../logger/Logger';

/**
 * An abstract class to manage the application configuration.
 */
export abstract class Configuration<T> {
  constructor(
    protected env: T,
    protected readonly schema: Joi.ObjectSchema,
    protected readonly logger: Logger
  ) {}

  /**
   * An abstract method to get a configuration value.
   * @param key The key of the configuration value to get.
   */
  public abstract get(key: keyof T): string | undefined;

  /**
   * Validates the configuration using Joi and the provided schema.
   */
  public async validate() {
    try {
      const validation = await this.schema.validateAsync(this.env, {
        warnings: true,
      });

      const warning = validation.warning as unknown as Joi.ValidationError;

      if (warning) {
        this.handleWarning(warning);
      }

      this.env = validation.value as T;
      this.logger.log('Configuration validated');
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /**
   * Handles a Joi warning.
   * @param warning A Joi warning.
   */
  protected handleWarning(warning: Joi.ValidationError) {
    warning.details.forEach((warning) => {
      this.logger.warn(warning.message);
    });
  }

  /**
   * Handles a Joi error.
   * @param error A Joi error.
   */
  protected handleError(error: Joi.ValidationError) {
    error.details.forEach((error) => {
      this.logger.error(error.message);
    });
  }
}
