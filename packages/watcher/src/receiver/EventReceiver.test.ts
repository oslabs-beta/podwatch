import { JsonStreamParser } from './../json-parser/JsonStreamParser';
import { AxiosInstance } from 'axios';
import { EventReceiver } from './EventReceiver';
import { EventDispatcher } from '../dispatcher/EventDispatcher';
import { Readable } from 'stream';
import { Logger } from '../logger/Logger';

describe('EventReceiver', () => {
  const mockStream = {
    pipe: jest.fn(() => new Readable()),
    unpipe: jest.fn(),
  };
  const mockKubernetesInstance = {
    get: jest.fn(async (url: string, options: any) => {
      if (url.includes('watch=true')) {
        return {
          data: mockStream,
        };
      } else {
        return {
          data: {
            items: [
              {
                metadata: {
                  resourceVersion: '123',
                },
              },
            ],
          },
        };
      }
    }),
  } as unknown as AxiosInstance;

  const mockJsonParser = {
    on: jest.fn(),
  } as unknown as JsonStreamParser;

  const mockDispatcher = {
    dispatch: jest.fn(),
  } as unknown as EventDispatcher;

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
  } as unknown as Logger;

  const receiver: EventReceiver = new EventReceiver(
    mockKubernetesInstance,
    mockJsonParser,
    mockDispatcher,
    mockLogger
  );

  it('should be defined', () => {
    expect(receiver).toBeDefined();
  });

  it('should get the latest resource version and call the api with it', async () => {
    await receiver.start();

    expect(mockKubernetesInstance.get).toBeCalledTimes(2);
    expect(mockKubernetesInstance.get).toBeCalledWith(
      expect.stringContaining('resourceVersion=123'),
      expect.anything()
    );
  });

  it('should pipe the stream to the json parser', async () => {
    await receiver.start();
    expect(mockStream.pipe).toBeCalledWith(mockJsonParser);
  });
});
