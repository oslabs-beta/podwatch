import { NativeKEvent } from './NativeKEvent';

/**
 * A formatted Kubernetes error. This is the data that is sent to the Podwatch web application or custom server.
 */
export interface KError {
  /**
   * The name of the Kubernetes object that the event is associated with.
   */
  name: string;

  /**
   * The reason for the event. This is a short string that gives the reason for the transition into the object's current status.
   */
  reason: string;

  /**
   * A human-readable description of the status of this operation.
   */
  message: string;

  /**
   * The type of the event. This is always Warning or Error.
   */
  type: string;

  /**
   * The time at which the first event of this type was recorded
   */
  firstTimestamp: string;

  /**
   * The time at which the most recent occurrence of this event was recorded.
   */
  lastTimestamp: string;

  /**
   * The number of times this event has occurred.
   */
  count: number;

  /**
   * The native Kubernetes event.
   */
  nativeEvent: NativeKEvent;
}
