import {
  BadRequestException,
  InternalServerErrorException,
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

export const throwInternal = (message = 'Something went wrong') => {
  throw new InternalServerErrorException({ status: 500, message });
};
