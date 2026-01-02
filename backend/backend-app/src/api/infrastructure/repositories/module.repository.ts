import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from '../schemas/module.schema';

@Injectable()
export class ModuleRepository {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<Module>,
  ) {}

  async findById(id: number): Promise<Module | null> {
    return this.moduleModel.findOne({ id }).exec();
  }

  async Allmodules(): Promise<Module[] | null>{
    return this.moduleModel.find().exec()
  }
}