import { Controller, Get, Post, Body, UseInterceptors, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { loginDto } from '../domain/login.dto'
import { registerDto } from '../domain/register.dto';
import { JwtCookieInterceptor } from 'src/jwt-cookie.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  //inloggen
  @UseInterceptors(JwtCookieInterceptor)
  @Post('/login')
  async Login(@Body() loginDto: loginDto) {
    return await this.authService.login(loginDto)
  }

  //registreren
  @Post('/register')
  async Register(@Body() registerDto: registerDto) {
    const user = await this.authService.register(registerDto);
    return { Message: 'User registered', user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('access_token');
    return { message: 'Logged out' };
  }
}
