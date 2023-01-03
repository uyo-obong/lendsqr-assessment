import { Transformer } from '../lib/transformer/transform';

export class UserTransformer extends Transformer {
  async transform(data: any): Promise<Record<string, any>> {
    return {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      account_id: data.account_id,
      email: data.email,
      phone_number: data.phone_number,
      balance: data.wallet ?? 0,
      created: data.created,
      updated: data.updated,
    };
  }
}
