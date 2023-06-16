import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import { errorlogger, logger } from './shared/logger';
import { Server } from 'http';

process.on('uncaughtException', error => {
  errorlogger.error('Uncaught Exception:', error);
  process.exit(1);
});
let server: Server;

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('connect successful');

    server = app.listen(config.port, () => {
      logger.info(`the application is running on port ${config.port}`);
    });
  } catch (error: any) {
    errorlogger.error(`failed to connect database ${error.message}`);
  }
  process.on('unhandledRejection', error => {
    logger.info('unhandle rejection');
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();
process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  if (server) {
    server.close();
  }
});
