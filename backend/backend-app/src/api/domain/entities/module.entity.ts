export class ModuleEntity {
  constructor(
    public readonly id: string,              // Mongo _id als string
    public readonly name: string,
    public readonly shortdescription: string,
    public readonly description: string,
    public readonly content: string,
    public readonly studycredit: number,
    public readonly location: string,
    public readonly contact_id: string,
    public readonly level: string,
    public readonly learningoutcomes: string[],
    public readonly module_tags: string[],
    public readonly popularity_score: number,
    public readonly estimated_difficulty: string,
    public readonly available_spots: number,
    public readonly start_date: Date,
    public readonly updated_at: Date,
  ) {}
}
