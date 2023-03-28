import { NativeKEvent } from './NativeKEvent';

export interface KError {
  name: string;
  reason: string;
  message: string;
  type: string;
  firstTimestamp: string;
  lastTimestamp: string;
  count: number;
  nativeEvent: NativeKEvent;
}
