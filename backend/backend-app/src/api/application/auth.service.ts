import { Injectable, ConflictException, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { RegisterDto } from '../domain/dtos/register.dto';
import { LoginDto } from '../domain/dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from '../domain/dtos/authresponse.dto';
import * as crypto from 'crypto';
import { ProfileResponseDto } from '../domain/dtos/profileresponse.dto';
import { ChangeProfileDto } from '../domain/dtos/changeprofile.dto';
import * as argon2 from 'argon2';

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
        this.logger.log(`Login attempt for user: ${this.hashEmail(loginDto.email)}`);
        const user = await this.authRepository.findByEmail(loginDto.email);

        //kijken of de user bestaat
        if (!user) {
            this.logger.warn(`Login failed for user: ${this.hashEmail(loginDto.email)}`);
            throw new NotFoundException('Ongeldige gegevens');
        }

        //wachtwoord vergelijken met wachtwoordhash in database
        const isValid = await argon2.verify(user.password, loginDto.password);
        if (!isValid) {
            this.logger.warn(`Login failed for user: ${this.hashEmail(loginDto.email)}`);
            throw new UnauthorizedException('Ongeldige gegevens');
        }

        const accessToken = this.signAccessToken(user.id.toString(), user.email);
        const refreshToken = this.signRefreshToken(user.id.toString(), user.email);

        await this.authRepository.updateRefreshToken(
            user.id.toString(),
            await argon2.hash(refreshToken),
        );

        this.logger.log(`Login successful for userId: ${user.id}`);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            csrfToken: crypto.randomBytes(24).toString('hex'),
        };
    }


    //gebruiker aanmaken als hij nieuw is.
    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        // check of user al bestaat
        this.logger.log(`Register attempt for user: ${this.hashEmail(registerDto.email)}`);
        const existing = await this.authRepository.findByEmail(registerDto.email);
        if (existing) {
            this.logger.warn(`Register failed: user already exists for user: ${this.hashEmail(registerDto.email)}`);
            throw new ConflictException('Er bestaat al een account met dit e-mailadres');
        }

        // password hashen
        const hashed: string = await argon2.hash(registerDto.password);

        // user opslaan via repository
        const user = await this.authRepository.createUser({ ...registerDto, password: hashed });

        //tokens aanmaken voor de gebruiker
        const accessToken = this.signAccessToken(user._id.toString(), user.email);
        const refreshToken = this.signRefreshToken(user._id.toString(), user.email);

        await this.authRepository.updateRefreshToken(
            user._id.toString(),
            await argon2.hash(refreshToken),
        );
        this.logger.log(`Register successful for userId: ${user._id}`);

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            csrfToken: crypto.randomBytes(24).toString('hex'),
        };
    }

    //userProfile ophalen uit database
    async getProfile(userId: string): Promise<ProfileResponseDto> {
        const profile = await this.authRepository.getProfileByUserId(userId);

        if (!profile) {
            throw new NotFoundException('Profiel niet gevonden');
        }

        // Return the ProfileResponseDto directly
        return profile;
    }

    //profiel aanpassen
    async changeProfile(profile: ChangeProfileDto, userId: string): Promise<void> {
        this.logger.log(`Change profile attempt for user ${userId}`);

        // Probeer de database te updaten via de repository
        const result = await this.authRepository.changeProfile(profile, userId);

        // Check of de update daadwerkelijk iets heeft geraakt
        if (!result.matched) {
            this.logger.warn(`Change profile failed: no user found with id ${userId}`);
            throw new NotFoundException('Gebruiker niet gevonden of ongeldig profiel ingevoerd');
        }

        this.logger.log(`Profile successfully updated for user ${userId}`);
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
            { sub: userId, email, jti: crypto.randomUUID(), },
            { expiresIn: '7d' },
            
        );
    }

    //uitloggen
    async logout(userId?: string): Promise<void> {
        this.logger.log(`Logout attempt for ${userId}`);
        if (!userId) {
            this.logger.warn('Logout attempt with no userId provided');
            return;
        }

        await this.authRepository.updateRefreshToken(userId, null);
        this.logger.log(`Logout successful for ${userId}`);
    }

    //token refreshen
    async refresh(refreshToken: string): Promise<AuthResponseDto> {
        if (!refreshToken) {
            this.logger.warn('Refresh failed: no refresh token provided');
            throw new UnauthorizedException();
        }

        const payload = this.jwtService.verify(refreshToken);
        const user = await this.authRepository.findById(payload.sub);

        if (!user) {
            throw new UnauthorizedException();
        }

        // valideer hash
        if (!user.refreshToken || !(await argon2.verify(user.refreshToken, refreshToken))) {
            throw new UnauthorizedException();
        }

        // refreshToken rotatie
        const newRefreshToken = this.signRefreshToken(user.id.toString(), user.email);
        await this.authRepository.updateRefreshToken(user.id.toString(), await argon2.hash(newRefreshToken));

        return {
            accessToken: this.signAccessToken(user.id.toString(), user.email),
            refreshToken: newRefreshToken,
            csrfToken: crypto.randomBytes(24).toString('hex'),
        };
    }

    private hashEmail(email: string): string {
        return crypto.createHash('sha256').update(email).digest('hex');
    }
}