import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(
    helmet({
      contentSecurityPolicy: false, // moet in productie anders
    }),
  );
  app.use(cookieParser());

  //CORS voor frontend
  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true,               // indien je cookies/sessies gebruikt
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
