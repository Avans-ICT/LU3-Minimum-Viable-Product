import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ModuleService } from '../application/module.service';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get(':id')
  async getModuleById(@Param('id', ParseIntPipe) id: number) {
    return this.moduleService.getModuleById(id);
  }


  @Get()
  async getAllModules() {
    return this.moduleService.getAllModules()
  }
}