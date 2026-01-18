import { NestFactory } from '@nestjs/core' ;
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { winstonLogger } from './logger/winston.logger';
import { ValidationExceptionFilter } from './logger/validationerror.logger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: winstonLogger,
    });
  
    const configService = app.get(ConfigService);
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    app.useGlobalFilters(new ValidationExceptionFilter());
    app.getHttpAdapter().getInstance().trustProxy = true;
    app.use(
        helmet({
            contentSecurityPolicy: isProduction,
            hsts: isProduction
        }),
    );
    app.use(cookieParser());

    //CORS voor frontend
    app.enableCors({
        origin: configService.get<string>("FRONTEND_URL") || 'http://localhost:5173', // frontend URL
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
  
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();