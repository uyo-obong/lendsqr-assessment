import { injectable } from 'tsyringe';
import { IRequest, IResponse } from '../interfaces/http.interface';
import { RestController } from '../lib/base-controller';
import { WalletService } from '../services/wallet.service';
import { WalletTransformer } from '../transformer/wallet-transformer';
import { TransactionTransformer } from '../transformer/transaction-transformer';

@injectable()
class WalletController extends RestController {

  constructor(private walletService: WalletService) {
    super();
  }

  fund = async (req: IRequest, res: IResponse) => {
    const user = await this.walletService.fund(req, res);
    res.ok(await this.transform(user, new WalletTransformer()))
  };

  withdraw = async (req: IRequest, res: IResponse) => {
    const user = await this.walletService.withdraw(req, res);
    res.ok(await this.transform(user, new WalletTransformer()))
  };

  transaction = async (req: IRequest, res: IResponse) => {
    const trans = await this.walletService.transaction(req, res);
    res.ok(await this.collection(trans, new TransactionTransformer()))
  }

}

export default WalletController;
