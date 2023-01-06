import 'reflect-metadata';
import { DataSource as Source } from 'typeorm';
import configuration from './config';

export const DataSource = new Source(
  {
    type: 'mysql',
    host: configuration.database.host,
    port: 3306,
    username: configuration.database.username,
    password: configuration.database.password,
    database: configuration.database.database,
    synchronize: true,
    logging: true,
    entities: ['build/entities/*.{ts,js}'],
    migrations: ['build/entities/migrations/*.{ts,js}'],
    subscribers: []
  }
);
