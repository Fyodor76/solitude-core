import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const throwNotFound = (message = 'Resource not found') => {
  throw new NotFoundException({ status: 404, message });
};

export const throwBadRequest = (message = 'Invalid request') => {
  throw new BadRequestException({ status: 400, message });
};

export const throwUnauthorized = (message = 'Unauthorized') => {
  throw new UnauthorizedException({ status: 401, message });
};

export const throwInternal = (
  error?: unknown,
  safeMessage = 'Something went wrong',
) => {
  if (error instanceof Error) {
    Logger.error('[Internal Error]', error.stack || error.message);
    throw new InternalServerErrorException({
      status: 500,
      message: safeMessage,
      error: error.message,
    });
  }

  Logger.error('[Internal Error]', error);
  throw new InternalServerErrorException({
    status: 500,
    message: safeMessage,
  });
};

export const throwConflict = (message = 'Conflict error') => {
  throw new ConflictException({ status: 409, message });
};
