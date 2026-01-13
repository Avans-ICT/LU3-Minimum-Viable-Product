import { Controller, Get, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from '../application/favorite.service';
import { CsrfGuard } from 'src/csrf-guard';
import { FavoriteDto } from '../domain/dtos/favorite.dto';

@Controller('favorite')
@UseGuards(AuthGuard('jwt'))
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) { }

    @Get()
    async getFavorites(@Req() req) {
        return this.favoriteService.getFavorites(req.user.userId);
    }

    @UseGuards(CsrfGuard)
    @Post()
    async addFavorite(@Req() req, @Body() favoriteDto: FavoriteDto) {
        return this.favoriteService.addFavorite(req.user.userId, favoriteDto.moduleID);
    }

    @UseGuards(CsrfGuard)
    @Delete()
    async removeFavorite(@Req() req, @Body() favoriteDto: FavoriteDto) {
        return this.favoriteService.removeFavorite(req.user.userId, favoriteDto.moduleID);
    }
}