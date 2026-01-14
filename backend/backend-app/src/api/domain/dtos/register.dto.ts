import { IsEmail, IsString, MinLength, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
class Profile {
    @MaxLength(25)
    @IsString()
    firstName: string;

    @MaxLength(25)
    @IsString()
    lastName: string;
}

export class RegisterDto {
    @MaxLength(254)
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(255)
    password: string;

    @ValidateNested()
    @Type(() => Profile)
    profile: Profile;
}