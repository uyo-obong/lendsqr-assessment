import express, { Router } from 'express';
import { container } from 'tsyringe';
import UserController from '../../../controller/user.controller';
import UserValidator from '../../../validator/user.validator';
import auth from '../../../middleware/auth';

const UserRouter: Router = express.Router();
const User: any = container.resolve(UserController);
const userValidator: any = container.resolve(UserValidator);

UserRouter.post('/register', userValidator.register, User.register);
UserRouter.post('/login', userValidator.login, User.login);
UserRouter.get('/', auth, User.info);

export default UserRouter;
