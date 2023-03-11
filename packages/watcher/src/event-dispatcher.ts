import { AxiosInstance } from 'axios';
/*
From axios-webhook notes:
This function needs to be imported into the Event Dispatcher and then invoked. For example:
    import createAxiosInstance from './axios-webhook.ts';
    const instance = createAxiosInstance();
    instance.get('/someURL')
*/

import createAxiosInstance from './axios-webhook';
import { NativeKEvent } from './utils/types';

interface KErr {
  name: string;
  reason: string;
  message: string;
  type: string;
  firstTimestamp: string;
  lastTimestamp: string;
  count: number;
  nativeEvent: NativeKEvent;
}

const eventDispatcher = (instance: AxiosInstance) => {
  // leverage closure to persist data between invocations
  let reqTimer: NodeJS.Timeout;
  const data: KErr[] = [];

  return async (JSON: NativeKEvent) => {
    // stop the event from being dispatched if the argument is null or if the type is 'Normal'
    if (!JSON.object || JSON.object.type === 'Normal') return;

    // whenever the event is invoked, before the timeout is triggered, the timer is cleared
    clearTimeout(reqTimer);

    // destructuring the passed in argument to get the properties we need to populate the body of the Axios instnace/req
    const { reason, message, type, firstTimestamp, lastTimestamp, count } =
      JSON.object;

    const name = JSON.object.metadata.name;

    const filtered: KErr = {
      name,
      reason,
      message,
      type,
      firstTimestamp,
      lastTimestamp,
      count,
      nativeEvent: JSON,
    };

    // push the filtered data object to the data array
    data.push(filtered);

    const sendData = async () => {
      try {
        await instance.post('/', data);
      } catch (error) {
        console.error(error);
      }
    };

    // if the data array is greater than or equal to 20, then we will invoke the Axios instance/req without a timeout
    if (data.length >= 20) {
      // invoke the Axios instance/req
      await sendData();
      data.length = 0;
    }

    // otherwise, we will invoke the Axios instance/req with a timeout of 200ms
    else {
      reqTimer = setTimeout(async () => {
        // invoke the Axios instance/req
        await sendData();
        data.length = 0;
      }, 200);
    }
  };
};

export default eventDispatcher;
