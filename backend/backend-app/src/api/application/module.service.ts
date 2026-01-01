import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepository } from '../infrastructure/repositories/module.repository';
import { Module } from '../domain/entities/module.entity';

@Injectable()
export class ModuleService {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async getModuleById(id: number): Promise<Module> {
    const module = await this.moduleRepository.findById(id);
    
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    
    return module;
  }


  async getAllModules(): Promise<Module[] | null>{
    const module = await this.moduleRepository.Allmodules();

    if (!module) {
      throw new NotFoundException(`No modules found`);
    }
    
    return module;
  }
}