import { AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { Logger } from '../logger/Logger';
import { NativeKEvent } from '../types/NativeKEvent';
import { EventDispatcher } from './EventDispatcher';

const DISPATCH_IDLE_TIMEOUT = 100;
const MAX_DISPATCH_QUEUE_SIZE = 5;

describe('EventDispatcher', () => {
  const mockWebhookInstance = {
    post: jest.fn(),
  } as unknown as AxiosInstance;

  const mockConfig = {
    get: jest.fn((key: string) => {
      return {
        DISPATCH_IDLE_TIMEOUT,
        MAX_DISPATCH_QUEUE_SIZE,
      }[key];
    }),
  } as unknown as EnvConfiguration;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger;

  const dispatcher: EventDispatcher = new EventDispatcher(
    mockWebhookInstance,
    mockConfig,
    mockLogger
  );

  const mockEvent = {
    object: {
      type: 'Warning',
      reason: 'test',
      message: 'test',
      firstTimestamp: 'test',
      lastTimestamp: 'test',
      count: 1,
      metadata: {
        name: 'test',
      },
    },
  } as NativeKEvent;

  const convertedEvent = {
    name: 'test',
    reason: 'test',
    message: 'test',
    type: 'Warning',
    firstTimestamp: 'test',
    lastTimestamp: 'test',
    count: 1,
    nativeEvent: mockEvent,
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(dispatcher).toBeDefined();
  });

  it('should dispatch an event', async () => {
    dispatcher.dispatch(mockEvent);
    await delay(DISPATCH_IDLE_TIMEOUT + 100);

    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(1);
    expect(mockWebhookInstance.post).toHaveBeenCalledWith('/watch', [
      convertedEvent,
    ]);
  });

  it('should only dispatch after the idle timeout', async () => {
    dispatcher.dispatch(mockEvent);
    await delay(DISPATCH_IDLE_TIMEOUT - 100);
    dispatcher.dispatch(mockEvent);
    await delay(DISPATCH_IDLE_TIMEOUT + 100);

    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(1);
    expect(mockWebhookInstance.post).toHaveBeenCalledWith('/watch', [
      convertedEvent,
      convertedEvent,
    ]);
  });

  it('should dispatch immediately once max queue size is reached', async () => {
    const max = MAX_DISPATCH_QUEUE_SIZE;
    for (let i = 0; i < max - 1; i++) {
      dispatcher.dispatch(mockEvent);
    }
    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(0);
    dispatcher.dispatch(mockEvent);
    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(1);
  });

  it('should dispatch immediately once max queue size is reached and then dispatch more after idle timeout', async () => {
    const max = MAX_DISPATCH_QUEUE_SIZE;
    for (let i = 0; i < max - 1; i++) {
      dispatcher.dispatch(mockEvent);
    }
    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(0);
    dispatcher.dispatch(mockEvent);
    dispatcher.dispatch(mockEvent);
    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(1);
    await delay(DISPATCH_IDLE_TIMEOUT + 100);
    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(2);
  });

  it('should not dispatch if event type is normal', async () => {
    const mockEvent = {
      object: {
        type: 'Normal',
      },
    } as NativeKEvent;

    dispatcher.dispatch(mockEvent);
    await delay(DISPATCH_IDLE_TIMEOUT + 100);
    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(0);
  });
});
