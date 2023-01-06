import { config } from 'dotenv';
config();

const configuration = {
  appname: 'LendsqrAPIService',
  web: {
    port: process.env.PORT || '8001',
    jwt_secret: process.env.TOKEN_KEY || 'secret',
    header_name: process.env.HEADER_NAME || 'lendsqr-token',
    userServiceUrl:
      process.env.USER_SERVICE_URL || 'http://localhost:8001',
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    db: parseInt(process.env.REDIS_DB) || 0,
  },
  database: {
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  payment: {
    secret_key: process.env.PAYSTACK_SECRET,
    public_key: process.env.PAYSTACK_PUBLIC,
    base_url: process.env.PAYSTACK_BASEURL || 'https://api.paystack.co',
  }
};

export default configuration;
