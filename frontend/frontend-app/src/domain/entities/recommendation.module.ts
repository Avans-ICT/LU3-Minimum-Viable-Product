export default interface RecommendationModule {
    module_id: string;
    rank: number;
    score: number;
    _id: string;
    reasons?: {
        location?: string; 
        level?: string;
        credit?: string;     
    };
};