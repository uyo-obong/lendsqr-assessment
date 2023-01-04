import { Transformer } from '../lib/transformer/transform';

export class WalletTransformer extends Transformer {
  async transform(data: any): Promise<Record<string, any>> {
    return {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      account_id: data.account_id,
      wallet: data.wallet
    };
  }
}
