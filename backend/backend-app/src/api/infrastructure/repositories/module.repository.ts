import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Module, ModuleDocument } from "../schemas/module.schema";
import { User } from "../schemas/user.schema";

@Injectable()
export class ModuleRepository {
    constructor(
        @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    ) { }

    async findById(id: string): Promise<ModuleDocument | null> {
        return this.moduleModel.findById(id).exec();
    }

    async findAll(): Promise<ModuleDocument[]> {
        return this.moduleModel.find().exec();
    }

    async findByIds(ids: string[]): Promise<ModuleDocument[]> {
        return this.moduleModel.find({ _id: { $in: ids } }).exec();
    }

}