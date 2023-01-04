import { injectable } from 'tsyringe';
import { LoggerService } from './logger.service';
import { IRequest, IResponse } from '../interfaces/http.interface';
import { DataSource } from '../config/data-source';
import { UserEntity } from '../entities/user.entity';
import configuration from '../config/config';
import axios from 'axios';
import { TransactionEntity, TransactionStatus } from '../entities/transaction.entity';
import { parseInt } from 'lodash';

const crypto = require('crypto');
const Flutterwave = require('flutterwave-node-v3');

@injectable()
export class WalletService {
  constructor(private logger: LoggerService) {
  }


  /**
   * The method is used to fund wallet and log the transactions
   * @param req
   * @param res
   */
  public fund = async (req: IRequest, res: IResponse) => {
    this.logger.log('fund wallet...');

    // Initialized db transaction
    const queryRunner = DataSource.createQueryRunner();

    // Start transaction
    await queryRunner.startTransaction();

    try {
      const request = req.body;
      const user = await this.user(req);

      const secretKey = configuration.payment.secret_key;
      const publicKey = configuration.payment.public_key;

      const flw = new Flutterwave(publicKey, secretKey);

      const response = await flw.Transaction.verify({ id: request.transaction_id })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          return err
        });

      if (response.status === 'error') {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, response.message);
      }

      if (
        response.data.status === 'successful'
        && response.data.amount >= request.amount
        && response.data.currency === 'NGN') {

        const logTransaction = {
          amount: response.data.amount,
          reference: request.transaction_id,
          user: user,
          status: 'inFlow',
          description: 'Fund wallet',
          from: '',
          to: user.id
        };

        // Get a user details and try to update the wallet amount
        user.wallet += response.data.amount;
        await queryRunner.manager.save(user);

        // Log every transaction that happen
        const trans = await this.logTransaction(logTransaction);
        await queryRunner.manager.save(trans);

        await queryRunner.commitTransaction();
        return user;

      } else {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, 'Oops! kindly check the amount you sent');
      }

    } catch (e) {

      await queryRunner.rollbackTransaction();
      return res.badRequest(e.message);

    } finally {
      await queryRunner.release();
    }
  };


  /**
   *
   * @param req
   * @param res
   */
  public withdraw = async (req: IRequest, res: IResponse) => {

    // Initialized db transaction
    const queryRunner = DataSource.createQueryRunner();

    // Start transaction
    await queryRunner.startTransaction();

    try {
      const request = req.body;
      const user = await this.user(req);

      const secretKey = configuration.payment.secret_key;
      const publicKey = configuration.payment.public_key;

      if (user.wallet <= request.amount) {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, 'Insufficient balance');
      }

      // Deduct the amount the user want to withdraw from the wallet
      user.wallet -= request.amount;
      await queryRunner.manager.save(user);


      const ref = crypto.randomBytes(20).toString('hex');

      // This line handle the fund transaction using flutterwave
      const data = await this.initiateTransfer(request, ref, publicKey, secretKey);

      if (data.status === 'error') {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, data.message);
      }

      const logTransaction = {
        amount: request.amount,
        reference: ref,
        user: user,
        status: 'outFlow',
        description: 'Withdraw from wallet',
        from: '',
        to: user.id
      };

      // Log every transaction that happen
      const trans = await this.logTransaction(logTransaction);
      await queryRunner.manager.save(trans);

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return res.badRequest(undefined, err.message);
    }

  };


  public transaction = async (req: IRequest, res: IResponse) => {
    const { id } = req.user;
    return await DataSource.getRepository(TransactionEntity).find({ where: { user: { id } }, order: { created: 'desc'} });
  };

  private initiateTransfer = async (request, ref, publicKey, secretKey) => {
    const flw = new Flutterwave(publicKey, secretKey);

    const details = {
      account_bank: request.bank_code,
      account_number: request.account_number,
      amount: request.amount,
      narration: 'Withdraw from wallet',
      currency: 'NGN',
      reference: ref,
      debit_currency: 'NGN'
    };

    return await flw.Transfer.initiate(details)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });


  };


  /**
   * The method is used to log all the transactions that happen in the system
   * @param amount
   * @param reference
   * @param user
   * @param status
   * @param description
   * @param from
   * @param to
   */
  private logTransaction = async ({ amount, reference, user, status, description, from, to }) => {
    const context = {
      amount,
      ref: reference,
      description: description,
      from,
      to,
      user,
      status: TransactionStatus[status]
    };

    return DataSource.getRepository(TransactionEntity).create(context);
  };


  /**
   * The method fetch the auth user
   * @param req
   */
  private user = async (req) => {
    const { id } = req.user;
    return DataSource.getRepository(UserEntity).findOne({ where: { id } });
  };

}
