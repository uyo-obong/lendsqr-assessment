import _ from 'lodash';
import { IRequest, IResponse, INext } from '../../interfaces/http.interface';
import {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError,
  badGateway,
} from './types';

export default (_req: IRequest, res: IResponse, next: INext) => {
  const responseTypes = {
    ok,
    created,
    badRequest,
    unauthorized,
    forbidden,
    notFound,
    serverError,
    badGateway,
  };

  _.extend(res, responseTypes);
  next();
};
