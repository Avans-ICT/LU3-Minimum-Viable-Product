import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://mfit:poep@sampletestcluster.bjv6mt4.mongodb.net/'),
  ]
  
})
export class AppModule {}