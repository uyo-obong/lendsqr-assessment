import 'reflect-metadata';
import express, { Application } from 'express';
import config from './app/config/config';
import Routes from './app/routes';
import cors from 'cors';
import response from './app/lib/response';

import { container } from 'tsyringe';
import { LoggerService } from './app/services/logger.service';
import StatusCodes from './app/lib/response/status-codes';
import { DataSource } from './app/config/data-source';
const logger: any = container.resolve(LoggerService);

class Server {
  private app: Application;
  constructor() {
    this.app = express();
  }

  // establish database connection
  private databaseConnection() {
    DataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!")
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err)
      })
  }

  public configuration() {
    this.databaseConnection()
    this.app.use(response);
    this.app.use(cors());
    this.app.use(express.json());

    this.app.get('/', (req, res) => {
      res.status(StatusCodes.OK).json('starting...');
    });

    // Mount routes
    Routes(this.app);
  }
  public async start() {
    const PORT: any = config.web.port;
    this.configuration();
    this.app.listen(PORT, () => {
      logger.log(`Server is listening on port ${PORT}.`);
    });
  }
}
const server = new Server();
server.start();
