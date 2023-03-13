import { EXTERNAL_KUBERNETES_PROXY_HOST } from './../utils/constants';
import axios from 'axios';
import { AxiosInstanceFactory } from './AxiosInstanceFactory';
import fs from 'fs';
import https from 'https';

export class KubernetesInstanceFactory extends AxiosInstanceFactory {
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

  private createExternalInstance() {
    const token = this.config.get('PODWATCH_SERVICE_ACCOUNT_TOKEN');
    const host = EXTERNAL_KUBERNETES_PROXY_HOST;
    const port = this.config.get('PODWATCH_PORT');
    return axios.create({
      baseURL: `${host}:${port}`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }

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
