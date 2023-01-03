import { Request, Response, NextFunction } from 'express';

export interface IRequest extends Request {
  user: any;
}

export interface IResponse extends Response {
  ok(data?: object | Array<object>, message?: string): void;
  created(data?: object | Array<object>, message?: string): any;
  badRequest(data?: object | Array<object>, message?: string): any;
  unauthorized(data?: object | Array<object>, message?: string): void;
  forbidden(data?: object | Array<object>, message?: string): void;
  notFound(data?: object | Array<object>, message?: string): any;
  serverError(data?: object | Array<object>, message?: string): void;
  badGateway(data?: object | Array<object>, message?: string): void;
}

export type INext = NextFunction;
