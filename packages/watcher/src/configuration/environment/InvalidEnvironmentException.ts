/**
 * A custom error class to be thrown when an invalid environment is detected.
 */
export class InvalidEnvironmentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidEnvironmentException';
  }
}
