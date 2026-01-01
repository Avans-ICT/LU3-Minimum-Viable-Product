import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './api/interface/auth.controller';
import { AuthService } from './api/application/auth.service';
import { AuthRepository } from './api/infrastructure/repositories/auth.repository';
import { LoggerMiddleware } from './api/middleware/logger';
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from './api/infrastructure/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(AuthController); // alleen voor AuthController
  }
}