import { AxiosError, AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { Logger } from '../logger/Logger';
import { NativeKEvent } from '../types/NativeKEvent';
import { KError } from '../types/KError';

/**
 * EventDispatcher is responsible for dispatching events to the Podwatch web application or custom server.
 */
export class EventDispatcher {
  private timeout: NodeJS.Timeout | null = null;
  private dataQueue: KError[] = [];

  constructor(
    private readonly webhookInstance: AxiosInstance,
    private readonly config: EnvConfiguration,
    private readonly logger: Logger
  ) {}

  /**
   * The dispatch method is responsible for queuing events for dispatch. The queued events will be sent when the queue length reaches the max queue length or when the idle timeout is reached.
   * @param event The Kubernetes event to be dispatched.
   * @returns
   */
  public dispatch(event: NativeKEvent) {
    if (!EventDispatcher.shouldDispatch(event)) return;
    this.logger.log('Queuing event for dispatch: ', event.object.reason);

    const kError = EventDispatcher.buildKError(event);
    this.enqueueData(kError);
  }

  /**
   * Enqueues data for dispatch. If the queue length reaches the max queue length or the idle timeout is reached, the queue will be sent to the Podwatch web application or custom server.
   * @param kError A formatted KError object.
   * @returns
   */
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

  /**
   * Sends the queued data to the Podwatch web application or custom server.
   */
  private async sendData() {
    try {
      const data = this.dataQueue;
      this.dataQueue = [];
      await this.webhookInstance.post('/watch', data);
    } catch (error: any) {
      this.logger.error('Encountered an error dispatching error data: ');
      this.logger.error(`Error: ${(error as AxiosError).message}`);
    }
  }

  /**
   * Determines if an event should be dispatched. Only events with a type of Warning or Error will be dispatched.
   * @param event The native Kubernetes event.
   * @returns A boolean indicating if the event should be dispatched.
   */
  private static shouldDispatch(event: NativeKEvent) {
    return event.object && event.object.type !== 'Normal';
  }

  /**
   * Converts a NativeKEvent to a KError.
   * @param event The native Kubernetes event.
   * @returns A formatted KError object.
   */
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
