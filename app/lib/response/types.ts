import { LoggerService } from '../../services/logger.service';
import ResponseMessages from '../response-messages';
import StatusCodes from './status-codes';

const logger = new LoggerService();

export function ok(data = null, message = null) {
  logger.log(`${message}, ${JSON.stringify(data)}`);
  this.status(StatusCodes.OK).json({
    status: ResponseMessages.STATUS_SUCCESS,
    data,
    message,
  });
}

export function created(
  data = null,
  message: string = ResponseMessages.DATA_CREATED
) {
  logger.log(`${message}, ${JSON.stringify(data)}`);
  this.status(StatusCodes.CREATED).json({
    status: ResponseMessages.STATUS_SUCCESS,
    data,
    message,
  });
}

export function badRequest(
  data = null,
  message: string = ResponseMessages.BAD_REQUEST
) {
  logger.error(`${message}, ${JSON.stringify(data)}`);
  this.status(StatusCodes.BAD_REQUEST).json({
    status: ResponseMessages.STATUS_ERROR,
    message,
    data: null,
  });
}

export function unauthorized(
  data = null,
  message: string = ResponseMessages.UNAUTHORIZED
) {
  logger.error(`${message}, ${data}`);
  this.status(StatusCodes.UNAUTHORIZED).json({
    status: ResponseMessages.STATUS_ERROR,
    message,
  });
}

export function forbidden(
  data = null,
  message: string = ResponseMessages.FORBIDDEN
) {
  this.status(StatusCodes.FORBIDDEN).json('forbidden');
}

export function notFound(data = null, message: string = ResponseMessages.NOT_FOUND) {
  this.status(StatusCodes.NOT_FOUND).json('notFound');
}

export function serverError(
  data = null,
  message: string = ResponseMessages.ERROR_OCURRED
) {
  logger.error(data);
  this.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: ResponseMessages.STATUS_ERROR,
    message,
  });
}

export function badGateway(
  data = null,
  message: string = ResponseMessages.BAD_GATEWAY
) {
  logger.error(`${message}, ${JSON.stringify(data)}`);
  this.status(StatusCodes.BAD_GATEWAY).json({
    status: ResponseMessages.STATUS_ERROR,
    message,
  });
}
