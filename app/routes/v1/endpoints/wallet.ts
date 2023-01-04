import express, { Router } from 'express';
import { container } from 'tsyringe';
import auth from '../../../middleware/auth';
import WalletController from '../../../controller/wallet.controller';
import WalletValidator from '../../../validator/wallet.validator';

const WalletRouter: Router = express.Router();
const Wallet: any = container.resolve(WalletController);
const walletValidator: any = container.resolve(WalletValidator);

WalletRouter.post('/fund', auth, walletValidator.fund, Wallet.fund);
WalletRouter.post('/withdraw', auth, Wallet.withdraw);
WalletRouter.get('/transactions', auth, Wallet.transaction);
WalletRouter.post('/transfer', auth, walletValidator.transfer, Wallet.transfer);

export default WalletRouter;
