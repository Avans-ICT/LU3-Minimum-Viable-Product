import { Controller, Get, Post, Body, UseInterceptors, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../domain/dtos/login.dto';
import { RegisterDto } from '../domain/dtos/register.dto';
import { JwtCookieInterceptor } from '../../jwt-cooki.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { CsrfGuard } from '../../csrf-guard';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    //inloggen
    @UseInterceptors(JwtCookieInterceptor)
    @Post('/login')
    async Login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto)
    }

    //registreren
    @UseInterceptors(JwtCookieInterceptor)
    @Post('/register')
    async Register(@Body() registerDto: RegisterDto) {
        return await this.authService.register(registerDto);
    }

    //protected endpoint testing purposes only
    
    @SkipThrottle()
    @UseGuards(AuthGuard('jwt'), CsrfGuard)
    @Get('/me')
    getProfile(@Req() req) {
        return req.user;
    }

    //uitloggen
    @UseGuards(AuthGuard('jwt'), CsrfGuard)
    @Post('/logout')
    async logout(@Req() req, @Res({ passthrough: true }) res) {
        await this.authService.logout(req.user?.userId);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        return { message: 'Logged out' };
    }

    //token refreshen
    @UseInterceptors(JwtCookieInterceptor)
    @UseGuards(CsrfGuard)
    @Post('/refresh')
    async refresh(@Req() req) {
        return await this.authService.refresh(req.cookies.refresh_token);
    }
}