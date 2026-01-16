import { Controller, Get, Param, Post, Body, UseGuards } from "@nestjs/common";
import { ModuleService } from "../application/module.service";
import { ModulesBatchDto } from "../domain/dtos/modulebatch.dto";
import { CsrfGuard } from "src/csrf-guard";
import { AuthGuard } from "@nestjs/passport";

@Controller("modules")
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get(":id")
    async getModuleById(@Param("id") id: string) {
        return this.moduleService.getModuleById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllModules() {
        return this.moduleService.getAllModules();
    }

    @UseGuards(AuthGuard('jwt'), CsrfGuard)
    @Post("/batch")
    async getModulesByIds(@Body() dto: ModulesBatchDto) {
        return this.moduleService.getModulesByIds(dto.ids);
    }
}