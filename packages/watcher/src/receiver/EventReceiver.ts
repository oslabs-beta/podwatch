import { NativeKEvent } from '../types/NativeKEvent';
import { AxiosError, AxiosInstance } from 'axios';
import { JsonStreamParser } from '../json-parser/JsonStreamParser';
import { EventDispatcher } from '../dispatcher/EventDispatcher';
import { Logger } from '../logger/Logger';
import { Readable } from 'stream';

/**
 * The EventReceiver is responsible for establishing an event stream from the Kubernetes API and dispatching the events to the EventDispatcher.
 */
export class EventReceiver {
  private resourceVersion: string | null = null;
  private restartAttempts: number = 0;
  private stream: Readable | null = null;

  constructor(
    private readonly kubernetesInstance: AxiosInstance,
    private readonly jsonStreamParser: JsonStreamParser,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger
  ) {}

  /**
   * Starts the event receiver by establishing an event stream from the Kubernetes API.
   */
  public async start() {
    await this.getInitialResourceVersion();
    await this.establishEventStream();
  }

  /**
   * Sets the initial resource version by making a request to the Kubernetes API for the latest events. The resource version will then be used to establish a watch stream that will receive all events from that point on.
   */
  private async getInitialResourceVersion() {
    try {
      const response = await this.kubernetesInstance.get('/api/v1/events');
      const events = response.data.items;
      const lastEvent = events[events.length - 1];

      this.logger.log(
        'Setting initial resource version to: ',
        lastEvent.metadata.resourceVersion
      );

      this.resourceVersion = lastEvent.metadata.resourceVersion;
    } catch (error) {
      this.logger.error('Error getting initial resource version: ', error);
      this.resourceVersion = null;
    }
  }

  /**
   * Establishes an event stream from the Kubernetes API. The stream will be piped to a JSON parser that will emit JSON objects as they are received. The JSON objects will then be dispatched to the event dispatcher.
   */
  private async establishEventStream() {
    const params = new URLSearchParams();
    params.set('watch', 'true');
    if (this.resourceVersion) {
      params.set('resourceVersion', this.resourceVersion);
    }

    const endpoint = `/api/v1/events?${params.toString()}`;
    this.logger.log('Establishing event stream from endpoint: ', endpoint);

    try {
      const response = await this.kubernetesInstance.get(endpoint, {
        responseType: 'stream',
      });
      this.stream = response.data as Readable;
      this.stream.pipe(this.jsonStreamParser);

      this.jsonStreamParser.on('json', (event: NativeKEvent) =>
        this.handleStreamEventReceived(event)
      );
      this.jsonStreamParser.on('error', (error: any) =>
        this.handleStreamError(error)
      );
      this.jsonStreamParser.on('close', () => this.handleStreamReconnect());

      this.logger.log('Event stream established.');
    } catch (error) {
      this.handleStreamError(error);
    }
  }

  /**
   * Processes an event received from the event stream. If the event is an 'Expired' event, the resource version will be unset and the stream will be restarted. Otherwise, the resource version will be updated and the event will be dispatched to the event dispatcher.
   * @param event An event received from the event stream.
   */
  private handleStreamEventReceived(event: NativeKEvent) {
    this.logger.log('Received event with reason: ', event.object.reason);

    if (event.object.reason === 'Expired') {
      this.logger.warn(
        'Latest resource version too old. Unsetting current resource version and restarting stream.'
      );

      this.resourceVersion = null;
      this.handleStreamReconnect();

      return;
    }

    this.resourceVersion = event.object.metadata.resourceVersion;
    this.eventDispatcher.dispatch(event);
  }

  private handleStreamError(error: any) {
    this.logger.warn('Error in event stream: ');
    this.logger.warn(`Error: ${(error as AxiosError).message}`);

    this.handleStreamReconnect(1000);
  }

  /**
   * Restarts the event stream after a delay. If the stream has been restarted too many times in a short period of time, the stream will not be restarted.
   * @param delay The delay in milliseconds before the stream will be restarted.
   */
  private handleStreamReconnect(delay = 0) {
    this.ejectStream();
    if (this.shouldRestart()) {
      setTimeout(() => {
        this.logger.info('Attempting to reconnect to event stream');
        this.establishEventStream();
      }, delay);
    }
  }

  /**
   * Ejects the stream from the JSON parser and removes all event listeners.
   */
  private ejectStream() {
    if (this.stream) {
      this.stream.unpipe(this.jsonStreamParser);
    }
  }

  /**
   * Determines whether the stream should be restarted. If the stream has been restarted too many times in a short period of time, the stream will not be restarted.
   * @returns True if the stream should be restarted, false otherwise.
   */
  private shouldRestart(): boolean {
    this.restartAttempts++;
    setTimeout(() => {
      this.restartAttempts--;
    }, 5000);

    if (this.restartAttempts >= 3) {
      this.logger.error(
        `Too many restart attempts (${this.restartAttempts} attempts in the last 5 seconds).`
      );
      return false;
    }
    return true;
  }
}
