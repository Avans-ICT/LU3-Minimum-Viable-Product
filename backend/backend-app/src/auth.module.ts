import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './api/interface/auth.controller';
import { AuthService } from './api/application/auth.service';
import { LoggerMiddleware } from './api/middleware/logger';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(AuthController); // alleen voor AuthController
  }
}
