export default interface RecommendationModule {
    module_id: string;
    rank: number;
    score: number;
    _id: string;
    reasons?: {
        constraints?: {
            location?: string;
            level?: string;
            credit?: string;
        };
        content?: {
            type: string;
            keywords?: string[];
            explanation?: string;
        };
    }
}