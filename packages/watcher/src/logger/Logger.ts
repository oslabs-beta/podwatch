/**
 * The logger class provides a simple, centralized interface for logging messages to the console with different log levels.
 */
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
