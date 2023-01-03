import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import { INext, IRequest, IResponse } from '../interfaces/http.interface';
import express from 'express';

export default (req: IRequest, res: IResponse, next: INext) => {
  const header = req.header(config.web.header_name);

  if (!header) return res.unauthorized();

  try {
    const decoded = jwt.verify(header, config.web.jwt_secret);
    if (!decoded) return res.unauthorized();
    console.log(req)
    req.user = decoded;
    // set user auth token
    req.user.token = header;
    next();
  } catch (error) {
    res.unauthorized(error.message);
  }
};
