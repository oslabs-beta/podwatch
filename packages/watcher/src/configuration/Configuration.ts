import Joi from 'joi';

export abstract class Configuration<T> {
  protected readonly env: T;
  protected readonly schema: Joi.ObjectSchema;

  constructor(env: T, schema: Joi.ObjectSchema) {
    this.env = env;
    this.schema = schema;
  }

  public abstract get(key: keyof T): string | undefined;

  protected async validate() {
    try {
      const { warning } = await this.schema.validateAsync(this.env, {
        warnings: true,
      });

      if (warning) {
        warning.forEach((warning) => {
          console.warn(warning.message);
        });
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}
