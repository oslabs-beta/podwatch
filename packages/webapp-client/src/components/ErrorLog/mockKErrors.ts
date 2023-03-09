import { Cluster } from '../../types/Cluster';
import { KError } from '../../types/KError';
import { NativeKEvent } from '../../types/NativeKEvent';

const mockCluster: Cluster = {
  id: 'cluster-id-123',
  name: 'Mock Cluster',
  description: 'A mock cluster',
  owner: {
    id: 'user-id-456',
    email: 'user@example.com',
    provider: 'local',
  },
  members: [],
};

const mockNativeKEvent: NativeKEvent = {
  type: 'mock-event-type',
  object: {
    kind: 'mock-object-kind',
    apiVersion: 'mock-api-version',
    metadata: {
      name: 'mock-object-name',
      namespace: 'mock-object-namespace',
      uid: 'mock-object-uid',
      resourceVersion: 'mock-resource-version',
      creationTimestamp: '2022-01-01T00:00:00Z',
      managedFields: [],
    },
    involvedObject: {
      kind: 'mock-involved-object-kind',
      namespace: 'mock-involved-object-namespace',
      name: 'mock-involved-object-name',
      uid: 'mock-involved-object-uid',
      apiVersion: 'mock-involved-object-api-version',
      resourceVersion: 'mock-involved-object-resource-version',
      fieldPath: 'mock-involved-object-field-path',
    },
    reason: '',
    message: '',
    source: {
      component: '',
      host: '',
    },
    firstTimestamp: '2022-01-01T00:00:00Z',
    lastTimestamp: '2022-01-01T00:00:00Z',
    count: 1,
    type: '',
    eventTime: null,
    reportingComponent: '',
    reportingInstance: '',
  },
};

const mockKError: KError = {
  id: 'kerror-id-123',
  name: 'Mock KError',
  reason: 'Failed',
  message: 'A mock KError',
  type: 'mock KError type',
  count: 1,
  firstTimestamp: new Date(),
  lastTimestamp: new Date(),
  cluster: mockCluster,
  nativeEvent: mockNativeKEvent,
};

const mockKError2: KError = {
  id: 'kerror-id-456',
  name: 'Mock KError 2',
  reason: 'FailedKillPod',
  message: 'Another mock KError',
  type: 'another mock KError type',
  count: 2,
  firstTimestamp: new Date(),
  lastTimestamp: new Date(),
  cluster: mockCluster,
  nativeEvent: mockNativeKEvent,
};

const mockKError3: KError = {
  id: 'kerror-id-789',
  name: 'Mock KError 3',
  reason: 'Failed',
  message: 'Yet another mock KError',
  type: 'yet another mock KError type',
  count: 3,
  firstTimestamp: new Date(),
  lastTimestamp: new Date(),
  cluster: mockCluster,
  nativeEvent: mockNativeKEvent,
};

const mockKError4: KError = {
  id: 'kerror-id-012',
  name: 'Mock KError 4',
  reason: 'FailedKillPod',
  message: 'One more mock KError',
  type: 'one more mock KError type',
  count: 4,
  firstTimestamp: new Date(),
  lastTimestamp: new Date(),
  cluster: mockCluster,
  nativeEvent: mockNativeKEvent,
};

const mockKErrors: KError[] = [
  mockKError,
  mockKError2,
  mockKError3,
  mockKError4,
];

export { mockKErrors };
