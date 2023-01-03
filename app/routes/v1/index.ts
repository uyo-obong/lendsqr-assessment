import express, { Router } from 'express';
import UserRouter from './endpoints/user';


const AppRouter: Router = express.Router();

AppRouter.use('/user', UserRouter);

export default AppRouter;
