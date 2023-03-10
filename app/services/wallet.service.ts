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
          return err;
        });

      if (response.status === 'error') {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, response.message);
      }

      if (
        response.data.status === 'successful'
        && response.data.amount >= request.amount
        && response.data.currency === 'NGN') {

        // Get a user details and try to update the wallet amount
        user.wallet += response.data.amount;
        await queryRunner.manager.save(user);

        // Log every transaction that happen
        const trans = await this.logTransaction(response.data.amount, request.transaction_id, user, 'inFlow', 'Deposit', '', user.id);
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

      // Log every transaction that happen
      const trans = await this.logTransaction(request.amount, ref, user, 'outFlow', 'Withdraw', '', user.id);
      await queryRunner.manager.save(trans);

      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return res.badRequest(undefined, err.message);
    }

  };


  /**
   * The method fetch all transactions details
   * @param req
   * @param res
   */
  public transaction = async (req: IRequest, res: IResponse) => {
    return await DataSource.getRepository(TransactionEntity).find({
      where: { user: { id: req.user.user } },
      order: { created: 'desc' }
    });
  };

  /**
   * The method is used to initialize bank transfer using flutterwave
   * @param request
   * @param ref
   * @param publicKey
   * @param secretKey
   */
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
   * The method is used to transfer money from one account to another
   * @param req
   * @param res
   */
  public transfer = async (req: IRequest, res: IResponse) => {

    // Initialized db transaction
    const queryRunner = DataSource.createQueryRunner();

    // Start transaction
    await queryRunner.startTransaction();

    try {
      const sender = await this.user(req);
      const request = req.body;

      // Validate the money in sender's wallet
      if (sender.wallet <= request.amount) {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, 'Insufficient balance');
      }

      const receiver = await DataSource.getRepository(UserEntity).findOne({ where: { account_id: request.account_id } });

      if (receiver.account_id === sender.account_id) {
        await queryRunner.rollbackTransaction();
        return res.badRequest(undefined, 'You can not send money to your self');
      }

      const ref = crypto.randomBytes(20).toString('hex');

      // Remove the money from sender's wallet
      sender.wallet -= parseInt(request.amount);
      const senderLog = await this.logTransaction(request.amount, ref, sender, 'outFlow', 'Transfer', sender.id, receiver.id);
      await queryRunner.manager.save(sender);
      await queryRunner.manager.save(senderLog);


      // Add the money to receiver's wallet
      receiver.wallet += parseInt(request.amount);
      const receiverLog = await this.logTransaction(request.amount, ref, receiver, 'inFlow', 'Transfer', sender.id, receiver.id);
      await queryRunner.manager.save(receiver);
      await queryRunner.manager.save(receiverLog);


      await queryRunner.commitTransaction();
      return true;
    } catch (err) {

      await queryRunner.rollbackTransaction();
      return res.badRequest(undefined, err.message);
    }

  };

  // private transactionLog = async (request, user, status, description, from, to) => {
  //   const ref = crypto.randomBytes(15).toString('hex');
  //
  //   const logTransaction = {
  //     amount: request.amount,
  //     reference: ref,
  //     user: user,
  //     status: status,
  //     description: description,
  //     from: from,
  //     to: to
  //   };
  //
  //   // Log every transaction that happen
  //   return await this.logTransaction(logTransaction);
  // }


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
  private logTransaction = async (amount, reference, user, status, description, from, to) => {
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
    return DataSource.getRepository(UserEntity).findOne({ where: { id: req.user.user } });
  };

}
