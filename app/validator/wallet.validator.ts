import { injectable } from 'tsyringe';
import { checkSchema } from 'express-validator';
import validate from '../lib/validate';
import UserValidator from './user.validator';
import { DataSource } from '../config/data-source';
import { UserEntity } from '../entities/user.entity';
import { TransactionEntity } from '../entities/transaction.entity';

@injectable()
class WalletValidator {
  fund = validate(
    checkSchema({
      amount: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'amount is required',
        },
        trim: true,
      },
      transaction_id: {
        in: ['body'],
        isString: {
          errorMessage: 'Reference is required',
        },
        trim: true,
        custom: {
          options: async (value) => {
            const user = await DataSource.getRepository(TransactionEntity).findOne({ where: {ref: value} });
            if (user) {
              throw new Error('Reference already in use');
            }
          }
        },
      },
    })
  );


  // Transfer

  transfer = validate(
    checkSchema({
      amount: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'amount is required',
        },
        trim: true,
      },
      account_id: {
        in: ['body'],
        isString: {
          errorMessage: 'Account Id is required',
        },
        trim: true,
        custom: {
          options: async (value) => {
            const user = await DataSource.getRepository(UserEntity).findOne({ where: {account_id: value} });
            if (!user) {
              throw new Error('Account Id does not exist');
            }
          }
        },
      },
    })
  );
}

export default WalletValidator;
