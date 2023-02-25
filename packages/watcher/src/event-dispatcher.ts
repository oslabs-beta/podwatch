import instance from './axios-instance';

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

const eventDispatcher = () => {
  // leverage closure to persist data between invocations
  let reqTimer: NodeJS.Timeout;
  const data: KErr[] = [];

  return async (JSON: NativeKEvent) => {
    // whenever the event is invoked, before the timeout is triggered, the timer is cleared
    clearTimeout(reqTimer);

    // destructuring the passed in argument to get the properties we need to populate the body of the Axios instnace/req
    const { reason, message, type, firstTimestamp, lastTimestamp, count } =
      JSON.object;

    const name = JSON.object.metadata.name;

    // if the type is 'Normal', then we will return early
    if (type === 'Normal') return;

    const filtered:KErr = {
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

    // if the data array is greater than or equal to 20, then we will invoke the Axios instance/req without a timeout
    if (data.length >= 20) {
      // invoke the Axios instance/req
      await instance.post({
        data,
      });
    }

    // otherwise, we will invoke the Axios instance/req with a timeout of 200ms
    else {
      reqTimer = setTimeout(async () => {
        // invoke the Axios instance/req
        await instance.post({
          data,
        });
      }, 200);
    }
  };
};
