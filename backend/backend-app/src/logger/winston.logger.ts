import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import { TransformableInfo } from 'logform';

const logDir = path.join(process.cwd(), 'logs');

const CONSOLE_CONTEXTS = [
  'NestFactory',
  'InstanceLoader',
  'RoutesResolver',
  'RouterExplorer',
  'NestApplication',
  'HTTP'
];

const nestOnly = winston.format((info: TransformableInfo) => {
  const context = String(info.context ?? '');
  return CONSOLE_CONTEXTS.includes(context) ? info : false;
});

const appOnly = winston.format((info: TransformableInfo) => {
  const context = String(info.context ?? '');
  return CONSOLE_CONTEXTS.includes(context) ? false : info;
});

export const winstonLogger = WinstonModule.createLogger({
  level: 'info',
  transports: [

    //Console
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        nestOnly(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, context, timestamp }) =>
          `${timestamp} [${level}] [${context}] ${message}`,
        ),
      ),
    }),

    //App logs
    new winston.transports.File({
      filename: path.join(logDir, 'app.log'),
      level: 'info',
      format: winston.format.combine(
        appOnly(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),

    //Errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        appOnly(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json(),
      ),
    }),
  ],
});