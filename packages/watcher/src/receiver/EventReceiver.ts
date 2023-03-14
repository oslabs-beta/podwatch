import { NativeKEvent } from '../types/NativeKEvent';
import { AxiosInstance } from 'axios';
import { JsonStreamParser } from '../json-parser/JsonStreamParser';
import { EventDispatcher } from '../dispatcher/EventDispatcher';
import { Logger } from '../logger/Logger';
import { Readable } from 'stream';

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

  public async start() {
    await this.getInitialResourceVersion();
    await this.establishEventStream();
  }

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

  private handleStreamEventReceived(event: NativeKEvent) {
    this.logger.log('Received event with reason: ', event.object.reason);

    if (event.object.reason === 'Expired') {
      this.logger.log(
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
    this.logger.error('Error in event stream: ');
    this.logger.error(error);

    this.handleStreamReconnect(1000);
  }

  private handleStreamReconnect(delay = 0) {
    this.ejectStream();
    if (this.shouldRestart()) {
      setTimeout(() => {
        this.logger.log('Attempting to reconnect to event stream');
        this.establishEventStream();
      }, delay);
    }
  }

  private ejectStream() {
    if (this.stream) {
      this.stream.unpipe(this.jsonStreamParser);
    }
  }

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
