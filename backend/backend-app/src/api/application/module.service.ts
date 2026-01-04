import { Injectable, NotFoundException } from "@nestjs/common";
import { ModuleRepository } from "../infrastructure/repositories/module.repository";
import { ModuleEntity } from "../domain/entities/module.entity";
import { toModuleEntity } from "../infrastructure/mappers/module.mapper";

@Injectable()
export class ModuleService {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  async getModuleById(id: string): Promise<ModuleEntity> {
    const doc = await this.moduleRepository.findById(id);

    if (!doc) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }

    return toModuleEntity(doc);
  }

  async getAllModules(): Promise<ModuleEntity[]> {
    const docs = await this.moduleRepository.findAll();
    if (docs.length === 0) throw new NotFoundException("No modules found");

    return docs.map(toModuleEntity);
  }
}
