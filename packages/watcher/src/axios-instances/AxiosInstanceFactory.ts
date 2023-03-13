import { AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { Logger } from '../logger/Logger';

export abstract class AxiosInstanceFactory {
  constructor(
    protected readonly config: EnvConfiguration,
    protected readonly logger: Logger
  ) {}

  public abstract create(): AxiosInstance;
}
