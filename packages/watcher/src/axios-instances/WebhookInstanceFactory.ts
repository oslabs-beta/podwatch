import axios, { AxiosInstance } from 'axios';
import { AxiosInstanceFactory } from './AxiosInstanceFactory';

/**
 * WebhookInstanceFactory is a concrete class responsible for creating an AxiosInstance for the webhook service.
 */
export class WebhookInstanceFactory extends AxiosInstanceFactory {
  /**
   * Determines whether the factory should create an AxiosInstance for the Podwatch web service or a custom server defined by the client.
   * @returns An AxiosInstance for the outbound webhook for dispatching events.
   */
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

  /**
   * Creates an AxiosInstance with a bse URL defined by the client.
   * @returns An AxiosInstance for a custom server URL defined by the client.
   */
  private createCustomServerInstance(): AxiosInstance {
    const baseURL = this.config.get('PODWATCH_CUSTOM_SERVER_URL');
    const timeout = Number(this.config.get('WEBHOOK_INSTANCE_TIMEOUT'));

    return axios.create({
      baseURL,
      timeout,
    });
  }

  /**
   * Creates an AxiosInstance with the appropriate headers and base URL for the Podwatch web service.
   * @returns An AxiosInstance for the Podwatch web service.
   */
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
