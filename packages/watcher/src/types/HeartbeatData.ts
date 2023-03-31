import { ServiceStatus } from './ServiceStatus';

export interface HearbeatData {
  status: ServiceStatus;
  timestamp: Date;
  logs: Log[];
}
