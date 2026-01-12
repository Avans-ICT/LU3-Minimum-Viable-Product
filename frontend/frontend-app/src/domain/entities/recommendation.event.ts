import type RecommendationModule from './recommendation.module';

export default interface RecommendationEvent {
    status: "PENDING" | "COMPLETED" | "FAILED";
    results?: RecommendationModule[];
    error_message?: string;
};