import { ServiceStatus } from '../types/ServiceStatus';
import { Log } from '../types/Log';

/**
 * The logger class provides a simple, centralized interface for logging messages to the console with different log levels.
 */
export class Logger {
  private logQueue: Log[] = [];
  private serviceStatus: ServiceStatus = 'OK';

  /**
   * Logs a general log message to the console. Does not save it to the log queue.
   * @param message
   * @param args
   */
  public log(message: string, ...args: any[]): void {
    this.serviceStatus = 'OK';
    console.log(message, ...args);
  }

  /**
   * Logs an info message to the console and saves it to the log queue
   * @param message
   * @param args
   */
  public info(message: string, ...args: any[]): void {
    this.serviceStatus = 'OK';

    const log = {
      message,
      args,
      level: 'info',
      timestamp: new Date(),
    };

    this.logQueue.push(log);
    console.info(message, ...args);
  }

  /**
   * Logs a warning message to the console and saves it to the log queue
   * @param message
   * @param args
   */
  public warn(message: string, ...args: any[]): void {
    const log = {
      message,
      args,
      level: 'warn',
      timestamp: new Date(),
    };

    this.logQueue.push(log);
    console.warn(message, ...args);
  }

  /**
   * Logs an error message to the console and saves it to the log queue. Sets the service status to ERROR.
   * @param message
   * @param args
   */
  public error(message: string, ...args: any[]): void {
    this.serviceStatus = 'ERROR';
    const log = {
      message,
      args,
      level: 'error',
      timestamp: new Date(),
    };

    this.logQueue.push(log);
    console.error(message, ...args);
  }

  /**
   * Returns the current service status. Defaults to OK if no errors have been logged.
   */
  public get status(): ServiceStatus {
    return this.serviceStatus;
  }

  /**
   * Gets the current log queue and resets it.
   * @returns An array of Log objects
   */
  public flush(): Log[] {
    const logs = this.logQueue;
    this.logQueue = [];
    return logs;
  }
}
