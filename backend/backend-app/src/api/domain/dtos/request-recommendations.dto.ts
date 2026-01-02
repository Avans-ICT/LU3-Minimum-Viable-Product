import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class RequestRecommendationsDto {
  @IsString()
  sessionId!: string;

  @IsString()
  requestId!: string;

  @IsInt()
  @Min(1)
  @Max(50)
  k!: number;

  @IsString()
  inputInterestsText!: string;

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
}