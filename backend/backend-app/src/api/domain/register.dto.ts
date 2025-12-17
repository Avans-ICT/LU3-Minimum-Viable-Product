import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class registerDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}