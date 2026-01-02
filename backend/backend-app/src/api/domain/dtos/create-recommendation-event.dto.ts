import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsIn,
  IsMongoId,
} from "class-validator";
import { Type } from "class-transformer";
import { RecommendationResultDto } from "./recommendation-result.dto";

export class CreateRecommendationEventDto {
  @IsIn(["recommendation_created"])
  eventType!: "recommendation_created";

  @IsString()
  sessionId!: string;

  @IsString()
  requestId!: string;

  @IsString()
  algorithm!: string;

  @IsString()
  modelVersion!: string;

  @IsInt()
  @Min(1)
  k!: number;

  @IsNumber()
  alpha!: number;

  @IsNumber()
  beta!: number;

  @IsString()
  inputInterestsText!: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsString()
  constraintsLocation?: string;

  @IsOptional()
  @IsString()
  constraintsLevel?: string;

  @IsOptional()
  @IsInt()
  constraintsStudycreditsMin?: number;

  @IsOptional()
  @IsInt()
  constraintsStudycreditsMax?: number;

  @ValidateNested({ each: true })
  @Type(() => RecommendationResultDto)
  results!: RecommendationResultDto[];
}