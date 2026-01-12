import { IsEmail, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProfileDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @ValidateNested()
    @Type(() => ProfileDto)
    profile: ProfileDto;
}