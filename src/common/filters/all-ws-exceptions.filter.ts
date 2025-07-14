import { Catch, WsExceptionFilter, Logger } from '@nestjs/common';

@Catch()
export class AllWsExceptionsFilter implements WsExceptionFilter {
  private readonly logger = new Logger(AllWsExceptionsFilter.name);

  catch(exception: any) {
    this.logger.error('WS Error caught:', exception);
  }
}
