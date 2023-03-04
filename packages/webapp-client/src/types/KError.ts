import { Cluster } from './Cluster';
import { NativeKEvent } from './NativeKEvent';

export interface KError {
  name: string;
  reason: string;
  message: string;
  type: string;
  count: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
  cluster: Cluster;
  nativeEvent: NativeKEvent;
}
