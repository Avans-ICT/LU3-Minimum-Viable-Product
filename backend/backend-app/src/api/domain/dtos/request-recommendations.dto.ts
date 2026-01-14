import { IsInt, IsOptional, IsString, Max, Min, MaxLength, IsIn } from "class-validator";

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
  @MaxLength(1000)
  inputInterestsText!: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  constraintsLocation?: string;

  @MaxLength(25)
  @IsOptional()
  @IsString()
  constraintsLevel?: string;

  @IsIn([15, 30])
  @IsOptional()
  @IsInt()
  constraintsStudycreditsMin?: number;

  @IsIn([15, 30])
  @IsOptional()
  @IsInt()
  constraintsStudycreditsMax?: number;
}