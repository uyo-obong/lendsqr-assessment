import { injectable } from 'tsyringe';
import { IRequest, IResponse } from '../interfaces/http.interface';
import { UserService } from '../services/user.service';
import { RestController } from '../lib/base-controller';
import { UserTransformer } from '../transformer/user-transformer';
import { LoginTransformer } from '../transformer/login-transformer';

@injectable()
class UserController extends RestController {

  constructor(private userService: UserService) {
    super();
  }

  register = async (req: IRequest, res: IResponse) => {
    const user = await this.userService.register(req, res);
    res.created(await this.transform(user, new UserTransformer()))
  };

  login = async (req: IRequest, res: IResponse) => {
    const user = await this.userService.login(req, res);
    res.ok(await this.transform(user, new LoginTransformer()), 'user login success')
  };

  info = async (req: IRequest, res: IResponse) => {
    const user = await this.userService.info(req, res);
    res.ok(await this.transform(user, new UserTransformer()))
  }

}

export default UserController;
