import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { registerDto } from '../domain/dtos/register.dto';
import { loginDto } from '../domain/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) { }

    //gebruikersgegevens valideren
    async login(loginDto: loginDto) {
        //user ophalen uit de database
        const user = await this.authRepository.findByEmail(loginDto.email);

        //kijken of de user bestaat
        if (!user) {
            throw new NotFoundException('Invalid credentials');
        }

        //wachtwoord vergelijken met wachtwoordhash in database
        const isValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.signAccessToken(user._id.toString(), user.email);
        const refreshToken = this.signRefreshToken(user._id.toString(), user.email);

        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.authRepository.updateRefreshToken(user._id.toString(), hashedRefresh);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }


    //gebruiker aanmaken als hij nieuw is.
    async register(registerDto: registerDto) {
        // check of user al bestaat
        const existing = await this.authRepository.findByEmail(registerDto.email);
        if (existing) {
            throw new ConflictException('User already exists');
        }

        // password hashen
        const hashed: string = await bcrypt.hash(registerDto.password, 10);

        // user opslaan via repository
        const user = await this.authRepository.createUser({ ...registerDto, password: hashed });

        //tokens aanmaken voor de gebruiker
        const accessToken = this.signAccessToken(user._id.toString(), user.email);
        const refreshToken = this.signRefreshToken(user._id.toString(), user.email);

        await this.authRepository.updateRefreshToken(
            user._id.toString(),
            await bcrypt.hash(refreshToken, 10),
        );

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        };
    }

    //token genereren
    private signAccessToken(userId: string, email: string): string {
        return this.jwtService.sign(
            { sub: userId, email },
            { expiresIn: '15m' },
        );
    }

    //refreshtoken genereren
    private signRefreshToken(userId: string, email: string): string {
        return this.jwtService.sign(
            { sub: userId, email },
            { expiresIn: '7d' },
        );
    }

    //uitloggen
    async logout(userId?: string) {
        if (!userId) return;

        await this.authRepository.updateRefreshToken(userId, null);
    }

    //token refreshen
    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const payload = this.jwtService.verify(refreshToken);

        const user = await this.authRepository.findById(payload.sub);
        if (!user?.refreshToken) {
            throw new UnauthorizedException();
        }

        const valid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!valid) {
            throw new UnauthorizedException();
        }

        const newAccessToken = this.signAccessToken(
            user._id.toString(),
            user.email,
        );

        const newRefreshToken = this.signRefreshToken(
            user._id.toString(),
            user.email,
        );

        await this.authRepository.updateRefreshToken(
            user._id.toString(),
            await bcrypt.hash(newRefreshToken, 10),
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
}