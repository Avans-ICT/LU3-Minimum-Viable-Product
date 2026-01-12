import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class ModulesBatchDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}