import { Transform, TransformCallback } from 'stream';

/**
 * A transform stream that parses JSON objects from a stream of data.
 */
export class JsonStreamParser extends Transform {
  private buffer: string;

  constructor() {
    super();
    this.buffer = '';
  }

  /**
   * Transforms the stream of data into JSON objects.
   * @param chunk A chunk of data from the stream that may contain multiple or partial JSON objects.
   * @param encoding
   * @param callback A callback to be called when the chunk has been processed.
   */
  _transform(chunk: any, encoding: any, callback: any) {
    this.buffer += chunk.toString();

    let jsonEndIndex = 0;
    while ((jsonEndIndex = this.buffer.indexOf('}', jsonEndIndex + 1)) !== -1) {
      try {
        const jsonObject = JSON.parse(this.buffer.slice(0, jsonEndIndex + 1));

        this.buffer = this.buffer.slice(jsonEndIndex + 1);

        this.emit('json', jsonObject);
      } catch (err) {}
    }

    callback();
  }

  /**
   * Clears the buffer when the stream has been flushed.
   * @param callback A callback to be called when the stream has been flushed.
   */
  _flush(callback: TransformCallback): void {
    this.buffer = '';
    callback();
  }
}
