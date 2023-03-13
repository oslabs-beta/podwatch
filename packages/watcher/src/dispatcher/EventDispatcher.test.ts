import { AxiosInstance } from 'axios';
import {
  DISPATCH_IDLE_TIMEOUT,
  MAX_DISPATCH_QUEUE_SIZE,
} from '../utils/constants';
import { NativeKEvent } from '../utils/types';
import { EventDispatcher } from './EventDispatcher';

describe('EventDispatcher', () => {
  const mockWebhookInstance = {
    post: jest.fn(),
  } as unknown as AxiosInstance;
  const dispatcher: EventDispatcher = new EventDispatcher(mockWebhookInstance);

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
    expect(mockWebhookInstance.post).toHaveBeenCalledWith('/', [
      convertedEvent,
    ]);
  });

  it('should only dispatch after the idle timeout', async () => {
    dispatcher.dispatch(mockEvent);
    await delay(DISPATCH_IDLE_TIMEOUT - 100);
    dispatcher.dispatch(mockEvent);
    await delay(DISPATCH_IDLE_TIMEOUT + 100);

    expect(mockWebhookInstance.post).toHaveBeenCalledTimes(1);
    expect(mockWebhookInstance.post).toHaveBeenCalledWith('/', [
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
