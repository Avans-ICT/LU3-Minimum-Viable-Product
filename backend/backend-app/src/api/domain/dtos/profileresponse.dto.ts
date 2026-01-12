import { IsOptional, IsString, IsNumber } from 'class-validator';

export class ProfileResponseDto {
    @IsString()
    firstName: string;
    
    @IsString()
    lastName: string;
    
    @IsOptional()
    @IsString()
    interests?: string;
    
    @IsOptional()
    @IsNumber()
    studycredits?: number;
    
    @IsOptional()
    @IsString()
    location?: string;
    
    @IsOptional()
    @IsString()
    level?: string;
}