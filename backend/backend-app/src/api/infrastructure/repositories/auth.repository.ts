import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: Partial<User>) {
    return this.userModel.create(user);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }
}