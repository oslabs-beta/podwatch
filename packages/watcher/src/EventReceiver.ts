import { NativeKEvent } from './utils/types';
import { AxiosInstance } from 'axios';
import { JsonStreamParser } from './JsonStreamParser';
import { EventDispatcher } from './EventDispatcher';

export class KEventReceiver {
  private resourceVersion: string | null = null;
  private restartAttempts: number = 0;
  private stream: any;

  constructor(
    private readonly kubernetesInstance: AxiosInstance,
    private readonly jsonStreamParser: JsonStreamParser,
    private readonly eventDispatcher: EventDispatcher
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

      console.log(
        'Setting initial resource version to: ',
        lastEvent.metadata.resourceVersion
      );

      this.resourceVersion = lastEvent.metadata.resourceVersion;
    } catch (error) {
      console.error('Error getting initial resource version: ');
      console.error(error);
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
    console.log('Establishing event stream from endpoint: ', endpoint);

    try {
      const response = await this.kubernetesInstance.get(endpoint, {
        responseType: 'stream',
      });
      this.stream = response.data;
      this.stream.pipe(this.jsonStreamParser);

      this.jsonStreamParser.on('json', (event: NativeKEvent) => {
        console.log('Received event with reason: ', event.object.reason);

        if (event.type === 'ERROR') {
          // Sometimes an error event will emit when the resource version is too old
          // In this case, we should just restart the stream with no resource version
          this.resourceVersion = null;
          this.handleStreamError(event);

          return;
        }

        this.resourceVersion = event.object.metadata.resourceVersion;
        this.eventDispatcher.dispatch(event);
      });

      this.jsonStreamParser.on('error', (error: any) => {
        console.log('Error occurred while parsing event stream:');
        console.error(error);

        this.handleStreamError(error);
      });

      this.jsonStreamParser.on('close', () => {
        console.log(`Event stream ended by server.`);

        this.ejectStream();

        console.log(
          `Reconnecting with last resource version: ${this.resourceVersion}`
        );
        this.establishEventStream();
      });
    } catch (error) {
      this.handleStreamError(error);
    }
  }

  private ejectStream() {
    if (this.stream) {
      this.stream.unpipe(this.jsonStreamParser);
      // this.jsonStreamParser.end();
    }
  }

  private handleStreamError(error: any) {
    console.error('Error in event stream: ');
    console.error(error);

    this.ejectStream();
    this.manageRestartAttempts();

    setTimeout(() => {
      console.log(
        `Retrying with last resource version: ${this.resourceVersion}`
      );
      this.establishEventStream();
    }, 1000);
  }

  private manageRestartAttempts() {
    this.restartAttempts++;
    setTimeout(() => {
      this.restartAttempts--;
    }, 5000);

    if (this.restartAttempts >= 3) {
      console.error(
        `Too many restart attempts (${this.restartAttempts} attempts in the last 5 seconds). Exiting.`
      );
      process.exit(1);
    }
  }
}
