import { injectable } from 'tsyringe';

@injectable()
export default class ResponseMessages {
  public static STATUS_SUCCESS = 'success';
  public static STATUS_ERROR = 'error';
  public static STATUS_FAILED = 'failed';
  public static BAD_REQUEST = 'BAD-REQUEST';
  public static ERROR_OCURRED = 'AN-ERROR-OCURRED';
  public static BAD_GATEWAY = 'BAD-GATEWAY';
  public static NOT_FOUND = 'NOT-FOUND';
  public static UNAUTHORIZED = 'UNAUTHORIZED-ACCESS';
  public static FORBIDDEN = 'FORBIDDEN';
  public static DATA_CREATED = 'DATA-CREATED';
}
