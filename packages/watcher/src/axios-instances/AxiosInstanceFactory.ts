import { AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { Logger } from '../logger/Logger';

/**
 * AxiosInstanceFactory is an abstract class responsible for creating an AxiosInstance based on the provided configuration.
 */
export abstract class AxiosInstanceFactory {
  constructor(
    protected readonly config: EnvConfiguration,
    protected readonly logger: Logger
  ) {}

  /**
   * Creates an AxiosInstance based on the provided configuration.
   */
  public abstract create(): AxiosInstance;
}
