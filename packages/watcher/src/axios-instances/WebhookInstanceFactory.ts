import axios, { AxiosInstance } from 'axios';
import { AxiosInstanceFactory } from './AxiosInstanceFactory';

export class WebhookInstanceFactory extends AxiosInstanceFactory {
  public create(): AxiosInstance {
    if (this.config.isUsingCustomServer) {
      this.logger.log(
        'Using custom server. Building instance with custom server URL.'
      );
      return this.createCustomServerInstance();
    }

    this.logger.log(
      'Using default server. Building instance with client ID and secret.'
    );
    return this.createWebInstance();
  }

  private createCustomServerInstance(): AxiosInstance {
    const baseURL = this.config.get('PODWATCH_CUSTOM_SERVER_URL');
    const timeout = Number(this.config.get('WEBHOOK_INSTANCE_TIMEOUT'));

    return axios.create({
      baseURL,
      timeout,
    });
  }

  private createWebInstance(): AxiosInstance {
    const clusterId = this.config.get('PODWATCH_CLIENT_ID');
    const clusterSecret = this.config.get('PODWATCH_CLIENT_SECRET');
    const baseURL = this.config.get('PODWATCH_WEB_SERVICE_URL');
    const timeout = Number(this.config.get('WEBHOOK_INSTANCE_TIMEOUT'));

    return axios.create({
      baseURL,
      timeout,
      headers: {
        'Cluster-ID': clusterId,
        'Cluster-Secret': clusterSecret,
      },
    });
  }
}
