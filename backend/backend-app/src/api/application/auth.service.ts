import { Injectable, ConflictException, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { RegisterDto } from '../domain/dtos/register.dto';
import { LoginDto } from '../domain/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from '../domain/dtos/authresponse.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly jwtService: JwtService
    ) { }

    //gebruikersgegevens valideren
    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        //user ophalen uit de database
        this.logger.log(`Login attempt for ${loginDto.email}`);
        const user = await this.authRepository.findByEmail(loginDto.email);

        //kijken of de user bestaat
        if (!user) {
            this.logger.warn(`Login failed: user not found for ${loginDto.email}`);
            throw new NotFoundException('Invalid credentials');
        }

        //wachtwoord vergelijken met wachtwoordhash in database
        const isValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isValid) {
            this.logger.warn(`Login failed: invalid password for ${loginDto.email}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.signAccessToken(user._id.toString(), user.email);
        const refreshToken = this.signRefreshToken(user._id.toString(), user.email);

        await this.authRepository.updateRefreshToken(
            user._id.toString(),
            await bcrypt.hash(refreshToken, 10),
        );

        this.logger.log(`Login successful for ${loginDto.email} (userId: ${user._id})`);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            csrfToken: crypto.randomBytes(24).toString('hex'),
        };
    }


    //gebruiker aanmaken als hij nieuw is.
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        // check of user al bestaat
        this.logger.log(`Register attempt for ${registerDto.email}`);
        const existing = await this.authRepository.findByEmail(registerDto.email);
        if (existing) {
            this.logger.warn(`Register failed: user already exists for ${registerDto.email}`);
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
        this.logger.log(`Register successful for ${registerDto.email} (userId: ${user._id})`);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            csrfToken: crypto.randomBytes(24).toString('hex'),
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
    async logout(userId?: string) : Promise<void>{
        this.logger.log(`Logout attempt for ${userId}`);
        if (!userId) {
            this.logger.warn('Logout attempt with no userId provided');
            return;
        }

        await this.authRepository.updateRefreshToken(userId, null);
        this.logger.log(`Logout successful for ${userId}`);
    }

    //token refreshen
    async refresh(refreshToken: string): Promise<AuthResponseDto>  {
        if (!refreshToken) {
            this.logger.warn('Refresh failed: no refresh token provided');
            throw new UnauthorizedException();
        }

        const payload = this.jwtService.verify(refreshToken);

        const user = await this.authRepository.findById(payload.sub);
        if (!user?.refreshToken) {
            this.logger.warn(`Refresh failed: no refresh token stored for userId ${payload.sub}`);
            throw new UnauthorizedException();
        }

        const valid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!valid) {
            this.logger.warn(`Refresh failed: invalid refresh token for userId ${user._id}`);
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
        this.logger.log(`Refresh successful for userId ${user._id}`);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            csrfToken: crypto.randomBytes(24).toString('hex'),
        };
    }
}