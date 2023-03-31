import { AxiosInstance } from 'axios';
import { EnvConfiguration } from '../configuration/environment/EnvConfiguration';
import { ServiceStatus } from '../types/ServiceStatus';
import { Logger } from './../logger/Logger';

interface HearbeatData {
  status: ServiceStatus;
  timestamp: Date;
  logs: Log[];
}

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

  private heartbeat() {
    this.dataQueue.push({
      status: this.logger.status,
      timestamp: new Date(),
      logs: this.logger.flush(),
    });
  }

  private async sendData() {
    const heartbeatData = this.dataQueue.shift();

    try {
      await this.webhookInstance.post('/heartbeat', heartbeatData);
    } catch (error) {
      this.logger.error('Failed to send heartbeat data', error);
    }
  }
}
