import { IsOptional, IsString, IsNumber, IsIn, MaxLength } from 'class-validator';

export class ChangeProfileDto {
    @IsOptional()
    @MaxLength(25)
    @IsString()
    firstName?: string;

    
    @IsOptional()
    @MaxLength(25)
    @IsString()
    lastName?: string;

    @MaxLength(1000)
    @IsString()
    interests: string;

    @IsOptional()
    @IsNumber()
    @IsIn([15, 30], { message: 'Study credits must be 15 or 30' })
    studycredits?: number;

    @IsOptional()
    @IsString()
    @IsIn(['Breda', 'Den Bosch', 'Tilburg'], { message: 'Location must be Breda, Den Bosch or Tilburg' })
    location?: string;

    @IsOptional()
    @IsString()
    @IsIn(['NLQF5', 'NLQF6'], { message: 'Level must be NLQF5 or NLQF6' })
    level?: string;
}