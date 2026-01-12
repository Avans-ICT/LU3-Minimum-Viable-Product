import { Module as NestModule } from "@nestjs/common";
import { FavoriteController } from "./api/interface/favorite.controller";
import { FavoriteRepository } from "./api/infrastructure/repositories/favorite.repository";
import { FavoriteService } from "./api/application/favorite.service";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "./api/infrastructure/schemas/user.schema";
@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
})
export class favoriteModule {}