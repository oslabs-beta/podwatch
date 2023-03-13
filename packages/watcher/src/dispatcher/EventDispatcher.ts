import { AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { Logger } from '../logger/Logger';
import { KError, NativeKEvent } from '../types/types';

export class EventDispatcher {
  private timeout: NodeJS.Timeout | null = null;
  private dataQueue: KError[] = [];

  constructor(
    private readonly webhookInstance: AxiosInstance,
    private readonly config: EnvConfiguration,
    private readonly logger: Logger
  ) {}

  public dispatch(event: NativeKEvent) {
    if (!EventDispatcher.shouldDispatch(event)) return;
    this.logger.log('Queuing event for dispatch: ', event.object.reason);

    const kError = EventDispatcher.buildKError(event);
    this.enqueueData(kError);
  }

  private enqueueData(kError: KError) {
    const maxQueueLength = Number(this.config.get('MAX_DISPATCH_QUEUE_SIZE'));
    const idleTimeout = Number(this.config.get('DISPATCH_IDLE_TIMEOUT'));

    this.dataQueue.push(kError);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (this.dataQueue.length >= maxQueueLength) {
      this.logger.log(
        `Dispatching ${this.dataQueue.length} queued errors (max queue length reached)`
      );
      this.sendData();
      return;
    }

    this.timeout = setTimeout(async () => {
      this.logger.log(
        `Dispatching ${this.dataQueue.length} queued errors (idle timeout reached)`
      );
      await this.sendData();
    }, idleTimeout);
  }

  private async sendData() {
    try {
      const data = this.dataQueue;
      this.dataQueue = [];
      await this.webhookInstance.post('/watch', data);
    } catch (error: any) {
      this.logger.error(
        'Encountered an error dispatching error data: ',
        error.message,
        error
      );
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
