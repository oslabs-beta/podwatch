import { Logger } from '../../logger/Logger';
import { EnvConfiguration } from './EnvConfiguration';
import { InvalidEnvironmentException } from './InvalidEnvironmentException';

describe('EnvConfiguration', () => {
  const logger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should accept a valid standard configuration', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: 'localhost',
        KUBERNETES_SERVICE_PORT: '8080',
        PODWATCH_SERVICE_ACCOUNT_TOKEN: undefined,
        PODWATCH_PORT: undefined,
        PODWATCH_CUSTOM_SERVER_URL: undefined,
        PODWATCH_CLIENT_ID: 'test',
        PODWATCH_CLIENT_SECRET: 'test',
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    await expect(config.validate()).resolves.toBeUndefined();
    expect(config.isHostedInternally).toBe(true);
    expect(config.isUsingCustomServer).toBe(false);
  });

  it('should accept a custom server configuration', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: 'localhost',
        KUBERNETES_SERVICE_PORT: '8080',
        PODWATCH_SERVICE_ACCOUNT_TOKEN: undefined,
        PODWATCH_PORT: undefined,
        PODWATCH_CUSTOM_SERVER_URL: 'https://localhost:3000',
        PODWATCH_CLIENT_ID: undefined,
        PODWATCH_CLIENT_SECRET: undefined,
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    await expect(config.validate()).resolves.toBeUndefined();
    expect(config.isHostedInternally).toBe(true);
    expect(config.isUsingCustomServer).toBe(true);
  });

  it('should accept a valid external configuration', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: undefined,
        KUBERNETES_SERVICE_PORT: undefined,
        PODWATCH_SERVICE_ACCOUNT_TOKEN: 'test',
        PODWATCH_PORT: '3000',
        PODWATCH_CUSTOM_SERVER_URL: undefined,
        PODWATCH_CLIENT_ID: 'test',
        PODWATCH_CLIENT_SECRET: 'test',
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    await expect(config.validate()).resolves.toBeUndefined();
    expect(config.isHostedInternally).toBe(false);
    expect(config.isUsingCustomServer).toBe(false);
  });

  it('should warn when internal and external vars provided', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: 'localhost',
        KUBERNETES_SERVICE_PORT: '8080',
        PODWATCH_SERVICE_ACCOUNT_TOKEN: 'test',
        PODWATCH_PORT: '3000',
        PODWATCH_CUSTOM_SERVER_URL: undefined,
        PODWATCH_CLIENT_ID: 'test',
        PODWATCH_CLIENT_SECRET: 'test',
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const warnSpy = jest.spyOn(logger, 'warn');

    await expect(config.validate()).resolves.toBeUndefined();
    expect(config.isHostedInternally).toBe(true);
    expect(config.isUsingCustomServer).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
  it('should warn when client id and secret provided with customer server', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: 'localhost',
        KUBERNETES_SERVICE_PORT: '8080',
        PODWATCH_SERVICE_ACCOUNT_TOKEN: undefined,
        PODWATCH_PORT: undefined,
        PODWATCH_CUSTOM_SERVER_URL: 'test',
        PODWATCH_CLIENT_ID: 'test',
        PODWATCH_CLIENT_SECRET: 'test',
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const warnSpy = jest.spyOn(logger, 'warn');

    await expect(config.validate()).resolves.toBeUndefined();
    expect(config.isHostedInternally).toBe(true);
    expect(config.isUsingCustomServer).toBe(true);
    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
  it('should error when neither internal nor external vars provided', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: undefined,
        KUBERNETES_SERVICE_PORT: undefined,
        PODWATCH_SERVICE_ACCOUNT_TOKEN: undefined,
        PODWATCH_PORT: undefined,
        PODWATCH_CUSTOM_SERVER_URL: 'test',
        PODWATCH_CLIENT_ID: undefined,
        PODWATCH_CLIENT_SECRET: undefined,
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const errorSpy = jest.spyOn(logger, 'error');

    await expect(config.validate()).rejects.toThrow(
      InvalidEnvironmentException
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
  it('should error when neither custom server nor client credentials provided', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: 'localhost',
        KUBERNETES_SERVICE_PORT: '8080',
        PODWATCH_SERVICE_ACCOUNT_TOKEN: undefined,
        PODWATCH_PORT: undefined,
        PODWATCH_CUSTOM_SERVER_URL: undefined,
        PODWATCH_CLIENT_ID: undefined,
        PODWATCH_CLIENT_SECRET: undefined,
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const errorSpy = jest.spyOn(logger, 'error');

    await expect(config.validate()).rejects.toThrow(
      InvalidEnvironmentException
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if service account token provided but no port', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: undefined,
        KUBERNETES_SERVICE_PORT: undefined,
        PODWATCH_SERVICE_ACCOUNT_TOKEN: 'test',
        PODWATCH_PORT: undefined,
        PODWATCH_CUSTOM_SERVER_URL: 'test',
        PODWATCH_CLIENT_ID: undefined,
        PODWATCH_CLIENT_SECRET: undefined,
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const errorSpy = jest.spyOn(logger, 'error');

    await expect(config.validate()).rejects.toThrow(
      InvalidEnvironmentException
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if port provided without service account token', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: undefined,
        KUBERNETES_SERVICE_PORT: undefined,
        PODWATCH_SERVICE_ACCOUNT_TOKEN: undefined,
        PODWATCH_PORT: '8080',
        PODWATCH_CUSTOM_SERVER_URL: 'test',
        PODWATCH_CLIENT_ID: undefined,
        PODWATCH_CLIENT_SECRET: undefined,
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const errorSpy = jest.spyOn(logger, 'error');

    await expect(config.validate()).rejects.toThrow(
      InvalidEnvironmentException
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if both client credentials are not provided', async () => {
    const config = new EnvConfiguration(
      {
        KUBERNETES_SERVICE_HOST: undefined,
        KUBERNETES_SERVICE_PORT: undefined,
        PODWATCH_SERVICE_ACCOUNT_TOKEN: 'test',
        PODWATCH_PORT: '8080',
        PODWATCH_CUSTOM_SERVER_URL: undefined,
        PODWATCH_CLIENT_ID: undefined,
        PODWATCH_CLIENT_SECRET: 'test',
        MAX_DISPATCH_QUEUE_SIZE: undefined,
        DISPATCH_IDLE_TIMEOUT: undefined,
        WEBHOOK_INSTANCE_TIMEOUT: undefined,
        PODWATCH_WEB_SERVICE_URL: undefined,
        EXTERNAL_KUBERNETES_PROXY_HOST: undefined,
      },
      logger
    );

    const errorSpy = jest.spyOn(logger, 'error');

    await expect(config.validate()).rejects.toThrow(
      InvalidEnvironmentException
    );
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });
});
