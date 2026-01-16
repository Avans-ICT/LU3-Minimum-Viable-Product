import {
  IsArray,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  ArrayNotEmpty,
  IsIn
} from "class-validator";
import { Type } from "class-transformer";

export class FeedbackItemDto {
  @IsMongoId()
  moduleId!: string;

  /**
   * Voor MVP: houden we dit simpel:
   * - "LIKE" (1 = liked, 0 = disliked)
   * - "RELEVANCE" (1..5)
   * - "CLICK" (1)
   */
  @IsIn(['LIKE', 'RELEVANCE', 'CLICK'])
  @IsString()
  feedbackType!: string;

  @IsInt()
  @Min(0)
  @Max(5)
  value!: number;
}

export class CreateRecommendationFeedbackDto {
  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  @Type(() => FeedbackItemDto)
  items!: FeedbackItemDto[];
}
