import { NativeKEvent } from '../types/NativeKEvent';
import { AxiosInstance } from 'axios';
import { JsonStreamParser } from '../json-parser/JsonStreamParser';
import { EventDispatcher } from '../dispatcher/EventDispatcher';
import { Logger } from '../logger/Logger';

export class EventReceiver {
  private resourceVersion: string | null = null;
  private restartAttempts: number = 0;
  private stream: any;

  constructor(
    private readonly kubernetesInstance: AxiosInstance,
    private readonly jsonStreamParser: JsonStreamParser,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger
  ) {
    this.jsonStreamParser.on('json', this.handleStreamEventReceived);
    this.jsonStreamParser.on('error', this.handleStreamError);
    this.jsonStreamParser.on('close', this.handleStreamDisconnect);
  }

  public async start() {
    await this.getInitialResourceVersion();
    await this.establishEventStream();
  }

  private handleStreamEventReceived(event: NativeKEvent) {
    this.logger.log('Received event with reason: ', event.object.reason);

    if (event.type === 'ERROR') {
      // Sometimes an error event will emit when the resource version is too old
      // In this case, we should just restart the stream with no resource version
      this.resourceVersion = null;
      this.handleStreamError(event);

      return;
    }

    this.resourceVersion = event.object.metadata.resourceVersion;
    this.eventDispatcher.dispatch(event);
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
      this.stream = response.data;
      this.stream.pipe(this.jsonStreamParser);

      // this.jsonStreamParser.on('json', (event: NativeKEvent) => {
      //   this.logger.log('Received event with reason: ', event.object.reason);

      //   if (event.type === 'ERROR') {
      //     // Sometimes an error event will emit when the resource version is too old
      //     // In this case, we should just restart the stream with no resource version
      //     this.resourceVersion = null;
      //     this.handleStreamError(event);

      //     return;
      //   }

      //   this.resourceVersion = event.object.metadata.resourceVersion;
      //   this.eventDispatcher.dispatch(event);
      // });

      // this.jsonStreamParser.on('error', (error: any) => {
      //   this.logger.log('Error occurred while parsing event stream:');
      //   this.logger.error(error);

      //   this.handleStreamError(error);
      // });

      // this.jsonStreamParser.on('close', () => {
      //   this.logger.log(`Event stream ended by server.`);

      //   this.ejectStream();

      //   this.logger.log(
      //     `Reconnecting with last resource version: ${this.resourceVersion}`
      //   );
      //   this.establishEventStream();
      // });
    } catch (error) {
      this.handleStreamError(error);
    }
  }

  private handleStreamDisconnect() {
    this.ejectStream();
    if (this.shouldRestart()) {
      this.establishEventStream();
    }
  }

  private ejectStream() {
    if (this.stream) {
      this.stream.unpipe(this.jsonStreamParser);
      // this.jsonStreamParser.end();
    }
  }

  private handleStreamError(error: any) {
    this.logger.error('Error in event stream: ');
    this.logger.error(error);

    this.ejectStream();
    if (!this.shouldRestart()) {
      return;
    }

    setTimeout(() => {
      this.logger.log(
        `Retrying with last resource version: ${this.resourceVersion}`
      );
      this.establishEventStream();
    }, 1000);
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
