import { injectable } from 'tsyringe';
import { LoggerService } from './logger.service';
import { IRequest, IResponse } from '../interfaces/http.interface';
import { DataSource } from '../config/data-source';
import { UserEntity } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@injectable()
export class UserService {
  constructor(private logger: LoggerService) {
  }


  /**
   *
   * @param req
   * @param res
   */
  public register = async (req: IRequest, res: IResponse) => {
    this.logger.log('saving test...');

    try {
      const request = req.body;
      request['password'] = bcrypt.hashSync(request.password, 10);
      request['account_id'] = await this.accountNumber();
      return DataSource.getRepository(UserEntity).save(request);

    } catch (e) {
      return res.badRequest(e.message);
    }
  };


  public login = async (req: IRequest, res: IResponse) => {
    try {
      const { email, password } = req.body;

      // Validate if user exist in our database
      const user = await DataSource.getRepository(UserEntity).findOne({ where: {email} });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          { user: user.id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        return {
          user,
          token
        }
      }
      res.badRequest(undefined, "Invalid Credentials")
    } catch (err) {
      console.log(err);
    }

  }


  public info = async (req: IRequest, res: IResponse) => {
    const {id} = req.user
    return DataSource.getRepository(UserEntity).findOne({where: {id}})
  }


  /**
   * Generate 10-digit numbers for add 026 as identification for all
   * users in the platform
   */
  private accountNumber = async () => {
      const num = Math.floor(Math.random() * 9000000);
      let str = num.toString();
      while (str.length < 8) {
        str = "026" + str;
      }
      return str;
  };

}
