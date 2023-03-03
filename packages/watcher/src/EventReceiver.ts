import { NativeKEvent } from './../../webapp-server/src/models/KErrorModel';
import { AxiosInstance } from 'axios';
import { JsonStreamParser } from './_JsonStreamParser';
import eventDispatcher from './event-dispatcher';

export class KEventReceiver {
  private resourceVersion: string = '0';
  constructor(
    private readonly kubernetesInstance: AxiosInstance,
    private readonly jsonStreamParser: JsonStreamParser,
    private readonly dispatch: ReturnType<typeof eventDispatcher>
  ) {
    this.getInitialResourceVersion();
  }

  public async start() {
    await this.getInitialResourceVersion();
    this.establishEventStream();
  }

  private async getInitialResourceVersion() {
    try {
      const response = await this.kubernetesInstance.get('/api/v1/events');
      const events = response.data.items;
      const lastEvent = events[events.length - 1];
      this.resourceVersion = lastEvent.metadata.resourceVersion;
    } catch (error) {
      console.error('Error getting initial resource version: ');
      console.error(error);
      this.resourceVersion = '0';
    }
  }

  private async establishEventStream() {
    const params = new URLSearchParams({
      watch: 'true',
      resourceVersion: this.resourceVersion,
    });
    try {
      const response = await this.kubernetesInstance.get(
        `/api/v1/events?${params.toString()}`,
        {
          responseType: 'stream',
        }
      );
      const stream = response.data;
      stream.pipe(this.jsonStreamParser);

      this.jsonStreamParser.on('json', (event: NativeKEvent) => {
        this.resourceVersion = event.object.metadata.resourceVersion;
        this.dispatch(event);
      });

      this.jsonStreamParser.on('error', (error: any) => {
        this.handleStreamError(error);
      });

      this.jsonStreamParser.on('end', () => {
        console.log('Event stream ended by server. Reconnecting...');
        this.establishEventStream();
      });
    } catch (error) {
      this.handleStreamError(error);
    }
  }

  private handleStreamError(error: any) {
    console.error('Error in event stream: ');
    console.error(error);
    console.log('Retrying...');
    setTimeout(() => {
      this.establishEventStream();
    }, 1000);
  }
}
