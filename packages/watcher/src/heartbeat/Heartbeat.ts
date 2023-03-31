import { AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { HearbeatData } from '../types/HeartbeatData';
import { Logger } from './../logger/Logger';

/**
 * Heartbeat is responsible for sending heartbeat data to the Podwatch Service or custom server.
 */
export class Heartbeat {
  private timeInterval: number;
  private dataQueue: HearbeatData[] = [];

  constructor(
    private readonly webhookInstance: AxiosInstance,
    private readonly config: EnvConfiguration,
    private readonly logger: Logger
  ) {
    this.timeInterval = Number(this.config.get('HEARTBEAT_INTERVAL'));

    setInterval(() => {
      this.heartbeat();
    }, this.timeInterval);
  }

  /**
   * The heartbeat method is responsible for queuing heartbeat data for dispatch. The queue is maintained to ensure all data is eventually sent to the Podwatch Service or custom server.
   */
  private heartbeat() {
    this.logger.log(
      'Sending heartbeat data with service status report and logs'
    );

    this.dataQueue.push({
      status: this.logger.status,
      timestamp: new Date(),
      logs: this.logger.flush(),
    });

    while (this.dataQueue.length > 0) {
      const heartbeatData = this.dataQueue.shift();
      if (heartbeatData) {
        this.sendData(heartbeatData);
      }
    }
  }

  /**
   * Sends heartbeat data to the Podwatch Service or custom server.
   * @param heartbeatData The heartbeat data to be sent to the Podwatch Service or custom server.
   */
  private async sendData(heartbeatData: HearbeatData) {
    try {
      await this.webhookInstance.post('/status', heartbeatData);
    } catch (error) {
      this.logger.error('Failed to send heartbeat data', error);
    }
  }
}
