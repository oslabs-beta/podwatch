import { AxiosInstance } from 'axios';
import { MAX_DISPATCH_QUEUE_SIZE } from './utils/constants';
import { KError, NativeKEvent } from './utils/types';

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
    });
  }

  private async sendData() {
    try {
      await this.webhookInstance.post('/', this.dataQueue);
      this.dataQueue = [];
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
