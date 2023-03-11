import { Configuration } from './Configuration';
import envSchema, { EnvSchema } from './schemas/envSchema';

export class EnvConfiguration extends Configuration<EnvSchema> {
  constructor(env: EnvSchema) {
    super(env, envSchema);
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
}
