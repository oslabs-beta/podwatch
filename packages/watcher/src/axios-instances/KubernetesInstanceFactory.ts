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
    return this.createClusterInstance();
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
