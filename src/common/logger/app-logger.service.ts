import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  setContext(context: string) {
    this.logger = new Logger(context);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  log(message: string) {
    this.logger.log(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
