import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //user aanmaken
  async createUser(user: Partial<User>) {
    return this.userModel.create(user);
  }

  //user per email vinden(login)
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  //Refreshtoken van user updaten
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.userModel.updateOne(
      { _id: userId },
      { refreshToken },
    );
  }

  //user vinden per id
  async findById(id: string) {
    return this.userModel.findById(id).lean();
  }
}