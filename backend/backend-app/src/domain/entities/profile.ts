export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,

    public readonly studyProgram: string,
    public readonly location: string,
    public readonly level: string,
    public readonly interests: string[],

    public readonly updatedAt: Date,
  ) {}
}