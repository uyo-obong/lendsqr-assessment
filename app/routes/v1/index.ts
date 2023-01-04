import express, { Router } from 'express';
import UserRouter from './endpoints/user';
import WalletRouter from './endpoints/wallet';


const AppRouter: Router = express.Router();

AppRouter.use('/user', UserRouter);
AppRouter.use('/user/wallet', WalletRouter);

export default AppRouter;
