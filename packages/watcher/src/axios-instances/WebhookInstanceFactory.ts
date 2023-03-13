import axios, { AxiosInstance } from 'axios';
import {
  PODWATCH_WEB_SERVICE_URL,
  WEBHOOK_INSTANCE_TIMEOUT,
} from '../utils/constants';
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
    const url = this.config.get('PODWATCH_CUSTOM_SERVER_URL');

    return axios.create({
      baseURL: url,
      timeout: WEBHOOK_INSTANCE_TIMEOUT,
    });
  }

  private createWebInstance(): AxiosInstance {
    const id = this.config.get('PODWATCH_CLIENT_ID');
    const secret = this.config.get('PODWATCH_CLIENT_SECRET');

    return axios.create({
      baseURL: PODWATCH_WEB_SERVICE_URL,
      timeout: WEBHOOK_INSTANCE_TIMEOUT,
      headers: {
        clusterid: id,
        clustersecret: secret,
      },
    });
  }
}
