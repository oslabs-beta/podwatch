/**
 * NativeKEvent is the type of the event that is sent by the kubernetes API
 */
export interface NativeKEvent {
  type: string;
  object: {
    kind: string;
    apiVersion: string;
    metadata: {
      name: string;
      namespace: string;
      uid: string;
      resourceVersion: string;
      creationTimestamp: string;
      managedFields: any[];
    };
    involvedObject: {
      kind: string;
      namespace: string;
      name: string;
      uid: string;
      apiVersion: string;
      resourceVersion: string;
      fieldPath: string;
    };
    reason: string;
    message: string;
    source: {
      component: string;
      host: string;
    };
    firstTimestamp: string;
    lastTimestamp: string;
    count: number;
    type: string;
    eventTime: null;
    reportingComponent: string;
    reportingInstance: string;
  };
}
