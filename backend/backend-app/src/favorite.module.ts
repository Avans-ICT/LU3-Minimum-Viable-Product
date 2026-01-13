import { Module as NestModule, MiddlewareConsumer } from "@nestjs/common";
import { FavoriteController } from "./api/interface/favorite.controller";
import { FavoriteRepository } from "./api/infrastructure/repositories/favorite.repository";
import { FavoriteService } from "./api/application/favorite.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./api/infrastructure/schemas/user.schema";
import { LoggerMiddleware } from "./api/middleware/logger";
@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
})
export class favoriteModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(FavoriteController); 
  }
}