import { Transform, TransformCallback } from 'stream';
export class JsonStreamParser extends Transform {
  private buffer: string;

  constructor() {
    super();
    this.buffer = '';
  }

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

  _flush(callback: TransformCallback): void {
    this.buffer = '';
    callback();
  }
}
