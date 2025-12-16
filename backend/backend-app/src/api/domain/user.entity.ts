export class User {
  id: string;
  email: string;
  passwordHash: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}