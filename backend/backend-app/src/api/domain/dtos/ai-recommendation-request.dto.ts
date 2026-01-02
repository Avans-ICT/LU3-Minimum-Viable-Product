export type AiRecommendationRequestDto = {
  requestId: string;
  sessionId: string;
  userId: string;
  k: number;
  input: {
    interestsText: string;
    constraints?: {
      location?: string;
      level?: string;
      studycreditsMin?: number;
      studycreditsMax?: number;
    };
  };
};