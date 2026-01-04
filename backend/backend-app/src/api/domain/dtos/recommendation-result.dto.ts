import { IsInt, IsMongoId, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";

export class RecommendationResultDto {
  @IsMongoId()
  moduleId!: string;

  @IsInt()
  @Min(1)
  rank!: number;

  @IsNumber()
  score!: number;

  @IsOptional()
  @IsObject()
  reasons?: Record<string, unknown>;
}