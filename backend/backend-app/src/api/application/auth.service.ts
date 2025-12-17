import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../infrastructure/repositories/auth.repository';
import { registerDto } from '../domain/register.dto';
import { loginDto } from '../domain/login.dto';
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

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
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
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }
  }
}
