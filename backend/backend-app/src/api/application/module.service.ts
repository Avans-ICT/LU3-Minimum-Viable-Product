import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { ModuleRepository } from "../infrastructure/repositories/module.repository";
import { ModuleEntity } from "../domain/entities/module.entity";
import { toModuleEntity } from "../infrastructure/mappers/module.mapper";

@Injectable()
export class ModuleService {
    private readonly logger = new Logger(ModuleService.name);
    constructor(private readonly moduleRepository: ModuleRepository) { }

    async getModuleById(id: string): Promise<ModuleEntity> {
        this.logger.log(`Fetching module by ID: ${id}`);
        const doc = await this.moduleRepository.findById(id);

        if (!doc) {
            this.logger.warn(`Module not found with ID: ${id}`);
            throw new NotFoundException(`Module with ID ${id} not found`);
        }
        this.logger.log(`Module found with ID: ${id}`);
        return toModuleEntity(doc);
    }

    async getAllModules(): Promise<ModuleEntity[]> {
        this.logger.log(`Fetching all modules`);
        const docs = await this.moduleRepository.findAll();
        if (docs.length === 0) {
            this.logger.warn(`No modules found`);
            throw new NotFoundException("No modules found");
        }

        this.logger.log(`Fetched ${docs.length} modules`);

        return docs.map(toModuleEntity);
    }
}
