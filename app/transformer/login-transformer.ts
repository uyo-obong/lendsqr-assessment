import { Transformer } from '../lib/transformer/transform';
import { UserTransformer } from './user-transformer';

export class LoginTransformer extends Transformer {
  async transform(data: any): Promise<Record<string, any>> {
    return {
      user: await this.item(data.user, new UserTransformer()),
      token: data.token
    };
  }
}
