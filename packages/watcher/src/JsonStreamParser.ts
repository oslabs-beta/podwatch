import { Transform, TransformCallback } from 'stream';

// Create a custom Transform stream that concatenates the chunks
// until it forms a complete JSON object
export class JsonStreamParser extends Transform {
  private buffer: string;

  constructor() {
    super();
    this.buffer = '';
  }

  // This function is called whenever a new chunk of data is received
  // It has to be named _transform, and it has to call the callback function when it's done
  _transform(chunk: any, encoding: any, callback: any) {
    // Append the new chunk to the buffer
    this.buffer += chunk.toString();

    // Note that a JSON object can end and new one can start in the same chunk
    // This while loop will look for a '}' character in the chunk
    // Which potentially marks the end of a valid JSON object
    // There may be a better way to do this, but this works
    let jsonEndIndex = 0;
    while ((jsonEndIndex = this.buffer.indexOf('}', jsonEndIndex + 1)) !== -1) {
      try {
        // Try to parse the JSON object, throw an error if it's invalid
        const jsonObject = JSON.parse(this.buffer.slice(0, jsonEndIndex + 1));

        // If it's valid, remove the JSON object from the buffer
        this.buffer = this.buffer.slice(jsonEndIndex + 1);

        // And emit the JSON object as an event
        // This is read with the parser.on('json', ...) call in index.ts
        this.emit('json', jsonObject);
      } catch (err) {
        // If the buffer doesn't contain a complete JSON object yet,
        // Do nothing and just wait for more chunks to come in
      }
    }

    // Call the callback function to let the stream know we're ready for the next chunk
    callback();
  }

  _flush(callback: TransformCallback): void {
    // If there's anything left in the buffer, it's invalid JSON
    // So we can just ignore it
    this.buffer = '';
    callback();
  }
}
