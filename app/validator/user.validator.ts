import { injectable } from 'tsyringe';
import { checkSchema } from 'express-validator';
import validate from '../lib/validate';
import { DataSource } from '../config/data-source';
import { UserEntity } from '../entities/user.entity';

@injectable()
class UserValidator {
  register = validate(
    checkSchema({
      first_name: {
        in: ['body'],
        isString: {
          errorMessage: 'first name is required',
        },
        trim: true,
      },
      last_name: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'last name is required',
        },
        trim: true,
      },
      email: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Email is required',
        },
        isEmail: {
          errorMessage: 'Email is should be valid',
        },
        trim: true,
        normalizeEmail: true,
        custom: {
          options: async (value) => {
            const user = await DataSource.getRepository(UserEntity).findOne({ where: {email: value} });
            if (user) {
              throw new Error('Email already in use');
            }
          }
        },
      },
      phone_number: {
        in: ['body'],
        isString: {
          errorMessage: 'Phone number must be a url',
        },
        trim: true,
        optional: true,
      },
      password: {
        in: ['body'],
        isString: {
          errorMessage: 'Password is required',
        },
        trim: true,
      },
    })
  );


//  LOGIN USER
  login = validate(
    checkSchema({
      email: {
        in: ['body'],
        notEmpty: {
          errorMessage: 'Email is required',
        },
        isEmail: {
          errorMessage: 'Email is should be valid',
        },
        trim: true,
        normalizeEmail: true,
      },
      password: {
        in: ['body'],
        isString: {
          errorMessage: 'Password is required',
        },
        trim: true,
      },
    })
  );
}

export default UserValidator;
