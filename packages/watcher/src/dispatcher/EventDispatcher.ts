import { AxiosInstance } from 'axios';
import {
  DISPATCH_IDLE_TIMEOUT,
  MAX_DISPATCH_QUEUE_SIZE,
} from '../utils/constants';
import { KError, NativeKEvent } from '../utils/types';

export class EventDispatcher {
  private timeout: NodeJS.Timeout | null = null;
  private dataQueue: KError[] = [];

  constructor(private webhookInstance: AxiosInstance) {}

  public dispatch(event: NativeKEvent) {
    if (!EventDispatcher.shouldDispatch(event)) return;

    const kError = EventDispatcher.buildKError(event);
    this.enqueueData(kError);
  }

  private enqueueData(kError: KError) {
    this.dataQueue.push(kError);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.dataQueue.length >= MAX_DISPATCH_QUEUE_SIZE) {
      this.sendData();
      return;
    }

    this.timeout = setTimeout(async () => {
      await this.sendData();
    }, DISPATCH_IDLE_TIMEOUT);
  }

  private async sendData() {
    try {
      const data = this.dataQueue;
      this.dataQueue = [];
      await this.webhookInstance.post('/', data);
    } catch (error) {
      console.error(error);
    }
  }

  private static shouldDispatch(event: NativeKEvent) {
    return event.object && event.object.type !== 'Normal';
  }

  private static buildKError(event: NativeKEvent): KError {
    const { reason, message, type, firstTimestamp, lastTimestamp, count } =
      event.object;

    const name = event.object.metadata.name;

    const kError: KError = {
      name,
      reason,
      message,
      type,
      firstTimestamp,
      lastTimestamp,
      count,
      nativeEvent: event,
    };

    return kError;
  }
}
