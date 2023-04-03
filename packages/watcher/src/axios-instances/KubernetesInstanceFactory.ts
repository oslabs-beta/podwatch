import axios from 'axios';
import { AxiosInstanceFactory } from './AxiosInstanceFactory';
import fs from 'fs';
import https from 'https';

/**
 * KubernetesInstanceFactory is responsible for creating an AxiosInstance for the Kubernetes API. The instance will be created with the appropriate headers and base URL based on the provided configuration.
 */
export class KubernetesInstanceFactory extends AxiosInstanceFactory {
  /**
   * Creates an AxiosInstance for the Kubernetes API based on the factory's configuration.
   * @returns An AxiosInstance for the Kubernetes API.
   */
  public create() {
    if (this.config.isHostedInternally) {
      this.logger.log(
        'Service hosted internally. Building instance with internal API token and certificate.'
      );
      return this.createClusterInstance();
    }

    this.logger.log(
      'Service hosted externally. Building instance with provided service account token and proxy port.'
    );
    return this.createExternalInstance();
  }

  /**
   * Creates an AxiosInstance for the Kubernetes API with the appropriate headers and base URL for when the service is hosted outside the cluster.
   * @returns An AxiosInstance for the Kubernetes API.
   */
  private createExternalInstance() {
    const token = this.config.get('PODWATCH_SERVICE_ACCOUNT_TOKEN');
    const host = this.config.get('EXTERNAL_KUBERNETES_PROXY_HOST');
    const port = this.config.get('PODWATCH_PORT');
    return axios.create({
      baseURL: `${host}:${port}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Creates an AxiosInstance for the Kubernetes API with the appropriate headers, https agent, and base URL for when the service is hosted inside the cluster.
   * @returns An AxiosInstance for the Kubernetes API.
   */
  private createClusterInstance() {
    const host = this.config.get('KUBERNETES_SERVICE_HOST');
    const port = this.config.get('KUBERNETES_SERVICE_PORT');

    let token: string;
    let cacert: Buffer;

    try {
      token = fs.readFileSync(
        '/var/run/secrets/kubernetes.io/serviceaccount/token',
        'utf-8'
      );

      cacert = fs.readFileSync(
        '/var/run/secrets/kubernetes.io/serviceaccount/ca.crt'
      );
    } catch (error) {
      this.logger.error(
        'Error reading Kubernetes service account token or certificate.'
      );
      throw error;
    }

    return axios.create({
      baseURL: `https://${host}:${port}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        ca: cacert,
      }),
    });
  }
}
