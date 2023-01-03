import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ResponseMessages from './response-messages';

const validate =
  (validations) => async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMsg = errors.array();

    return res.status(400).json({
      status: ResponseMessages.STATUS_FAILED,
      message: errorMsg[0].msg,
      // data: null,
    });
  };

export default validate;
