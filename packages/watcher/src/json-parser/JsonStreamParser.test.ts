import { JsonStreamParser } from './JsonStreamParser';

describe('JsonStreamParser', () => {
  it('should be defined', () => {
    const parser = new JsonStreamParser();
    expect(parser).toBeDefined();
  });

  it('should parse and emit a single json object', () => {
    const parser = new JsonStreamParser();
    const mockCallback = jest.fn();

    parser.on('json', mockCallback);

    parser.write('{"test": "value"}');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should parse and emit a single json object split over multiple chunks', () => {
    const parser = new JsonStreamParser();
    const mockCallback = jest.fn();

    parser.on('json', mockCallback);

    parser.write('{"test": "value');
    parser.write('"}');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should parse and emit multiple json objects', () => {
    const parser = new JsonStreamParser();
    const mockCallback = jest.fn();

    parser.on('json', mockCallback);

    parser.write('{"test": "value"}');
    parser.write('{"test": "value"}');
    parser.write('{"test": "value"}');

    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should parse and emit multiple json objects split over multiple chunks', () => {
    const parser = new JsonStreamParser();
    const mockCallback = jest.fn();

    parser.on('json', mockCallback);

    parser.write('{"test": "value"}{');
    parser.write('"test": "value"}{"te');
    parser.write('st": "value"}');

    expect(mockCallback).toHaveBeenCalledTimes(3);
    expect(mockCallback).toHaveBeenCalledWith({ test: 'value' });
  });

  it('should parse complex json object split over multiple chunks', () => {
    const parser = new JsonStreamParser();
    const mockCallback = jest.fn();

    parser.on('json', mockCallback);

    const complexObj = {
      apiVersion: 'v1',
      kind: 'Event',
      metadata: {
        name: 'test-event',
        namespace: undefined,
        selfLink: '/api/v1/namespaces/default/events/test-event',
        uid: 'test-uid',
        resourceVersion: 'test-resource-version',
        creationTimestamp: '2020-01-01T00:00:00Z',
      },
      involvedObjects: [
        {
          kind: 'Pod',
          namespace: null,
          name: 'test-pod',
          uid: 'test-uid',
          apiVersion: 1,
        },
        {
          kind: 'ReplicaSet',
          namespace: 'default',
          name: 'test-replicaset',
          uid: 'test-uid',
          apiVersion: 'apps/v1',
        },
      ],
    };

    const complexJson = JSON.stringify(complexObj);

    parser.write(complexJson.slice(0, 20));
    parser.write(complexJson.slice(20, 40));
    parser.write(complexJson.slice(40, 60));
    parser.write(complexJson.slice(60));

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(complexObj);
  });

  it('should handle extended network disruptions where the data resumes', async () => {
    const parser = new JsonStreamParser();
    const mockCallback = jest.fn();

    parser.on('json', mockCallback);

    parser.write('{"test": "value"}{"test": "');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    parser.write('value"}{"test": "value"}');

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith({ test: 'value' });
  });
});
