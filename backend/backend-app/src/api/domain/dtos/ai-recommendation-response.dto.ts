export type AiRecommendationResponseDto = {
  algorithm: string;
  modelVersion: string;
  results: Array<{
    module_id: string;
    rank: number;
    score: number;
    reasons?: Record<string, unknown>;
  }>;
};