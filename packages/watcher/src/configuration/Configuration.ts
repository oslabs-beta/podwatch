import Joi from 'joi';
import { Logger } from '../logger/Logger';

export abstract class Configuration<T> {
  constructor(
    protected readonly env: T,
    protected readonly schema: Joi.ObjectSchema,
    protected readonly logger: Logger
  ) {}

  public abstract get(key: keyof T): string | undefined;

  public async validate() {
    try {
      const validation = await this.schema.validateAsync(this.env, {
        warnings: true,
      });

      const warning = validation.warning as unknown as Joi.ValidationError;

      if (warning) {
        this.handleWarning(warning);
      }

      this.logger.log('Configuration validated');
    } catch (error: any) {
      this.handleError(error);
    }
  }

  protected handleWarning(warning: Joi.ValidationError) {
    warning.details.forEach((warning) => {
      this.logger.warn(warning.message);
    });
  }

  protected handleError(error: Joi.ValidationError) {
    error.details.forEach((error) => {
      this.logger.error(error.message);
    });
  }
}
