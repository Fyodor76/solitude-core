import { Logger } from '@nestjs/common';
import { throwInternal } from '../exceptions/http-exception.helper';

export async function tryCatch<T>(
  handler: () => Promise<T>,
  context: string,
): Promise<T> {
  try {
    return await handler();
  } catch (error) {
    Logger.error(`[${context}]`, error.stack || error.message);
    throwInternal(error);
  }
}
