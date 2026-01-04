export type AiRecommendationResponseDto = {
  algorithm: string;
  modelVersion: string;
  results: Array<{
    moduleId: string;
    rank: number;
    score: number;
    reasons?: Record<string, unknown>;
  }>;
};