import { Transformer } from '../lib/transformer/transform';

export class TransactionTransformer extends Transformer {
  async transform(data: any): Promise<Record<string, any>> {
    return {
      id: data.id,
      amount: data.amount,
      ref: data.ref,
      description: data.description,
      status: data.status,
      created: data.created,
      updated: data.updated
    };
  }
}
