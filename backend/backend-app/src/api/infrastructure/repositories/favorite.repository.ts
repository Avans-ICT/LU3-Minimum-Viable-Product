import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}


async addFavorite(userID: string, moduleID: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userID,{ $addToSet: { favorites: moduleID } },{ new: true }).exec();
  }

async removeFavorite(userID: string, moduleID: string): Promise<User | null> {
  return this.userModel.findByIdAndUpdate( userID,{ $pull: { favorites: moduleID } },{ new: true }).exec();
}

  async getFavorites(userID: string): Promise<string[] | null> {
    const user = await this.userModel.findById(userID).select('favorites').lean().exec();
    if (!user) return null;
    return user.favorites || [];
  }

}