import { Cluster } from './Cluster';
import { NativeKEvent } from './NativeKEvent';

export interface KError {
  id: string;
  name: string;
  reason: string;
  message: string;
  type: string;
  count: number;
  firstTimestamp: string;
  lastTimestamp: string;
  cluster: Cluster;
  nativeEvent: NativeKEvent;
}
