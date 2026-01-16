import { IsString, IsNotEmpty, Matches} from 'class-validator';

export class FavoriteDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Ongeldig moduleID' })
  moduleID: string;
}