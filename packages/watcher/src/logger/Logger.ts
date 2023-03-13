export class Logger {
  public log(message: string, ...args: any[]): void {
    console.info(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    console.error(message, ...args);
  }
}
