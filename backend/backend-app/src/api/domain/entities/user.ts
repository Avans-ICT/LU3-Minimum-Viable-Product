import { Profile } from "./profile";

export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public profile: Profile,
    public refreshToken?: string,
  ) {}
}