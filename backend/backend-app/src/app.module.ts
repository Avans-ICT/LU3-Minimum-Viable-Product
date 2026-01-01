import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://JurJurVugter:JoepJaapDeAap123@avanskeuze.pnotd1r.mongodb.net/'),
  ]
  
})
export class AppModule {}