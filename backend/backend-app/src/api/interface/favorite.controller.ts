import { Controller, Get, Post, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoriteService } from '../application/favorite.service';
import { CsrfGuard } from 'src/csrf-guard';
import { FavoriteDto } from '../domain/dtos/favorite.dto';

@Controller('favorite')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getFavorites(@Req() req) {
        return this.favoriteService.getFavorites(req.user.userId);
    }

    @UseGuards(CsrfGuard, AuthGuard('jwt'))
    @Post()
    async addFavorite(@Req() req, @Body() favoriteDto: FavoriteDto) {
        await this.favoriteService.addFavorite(req.user.userId, favoriteDto.moduleID);
    }

    @UseGuards(CsrfGuard, AuthGuard('jwt'))
    @Delete()
    async removeFavorite(@Req() req, @Body() favoriteDto: FavoriteDto) {
        await this.favoriteService.removeFavorite(req.user.userId, favoriteDto.moduleID);
    }
}