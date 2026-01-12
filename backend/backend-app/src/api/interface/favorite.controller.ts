import { Controller, Get, Param, Body, Post, Delete} from "@nestjs/common";
import { FavoriteService } from "../application/favorite.service";
import { User } from "../infrastructure/schemas/user.schema";
import { FavoriteDto } from "../domain/dtos/favorite.dto";

@Controller("favorite")
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  async addFavorite(@Body() favoriteDto: FavoriteDto): Promise<User> {
    return this.favoriteService.addFavorite(favoriteDto.userID, favoriteDto.moduleID);
  }

  @Get(":userId")
  async getFavorites(@Param("userId") userId: string) {
    return this.favoriteService.getFavorites(userId);
  }

  @Delete()
  async removeFavorite(@Body() favoriteDto: FavoriteDto): Promise<User> {
    return this.favoriteService.removeFavorite(favoriteDto.userID, favoriteDto.moduleID);
  }

}