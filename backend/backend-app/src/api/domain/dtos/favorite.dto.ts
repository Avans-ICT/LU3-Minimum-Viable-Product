import {IsString} from 'class-validator';

export class FavoriteDto {
    @IsString()
    moduleID: string;

    @IsString()
    userID: string;
}