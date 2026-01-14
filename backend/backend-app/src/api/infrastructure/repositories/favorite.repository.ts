import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { Module, ModuleDocument } from "../schemas/module.schema";
import { Types } from 'mongoose';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Module.name) private moduleModel: Model<Module>
  ) { }


  async addFavorite(userID: string, moduleID: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate({ $eq: userID }, { $addToSet: { favorites: moduleID } }, { new: true }).exec();
  }

  async removeFavorite(userID: string, moduleID: string): Promise<User | null> {
    return this.userModel.findByIdAndUpdate({ $eq: userID }, { $pull: { favorites: moduleID } }, { new: true }).exec();
  }

  async getFavorites(userID: string): Promise<string[] | null> {
    const user = await this.userModel.findById(userID).select('favorites').lean().exec();
    if (!user) return null;
    return user.favorites || [];
  }

  async findById(id: string): Promise<ModuleDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return this.moduleModel.findById(id).exec();
  }
}