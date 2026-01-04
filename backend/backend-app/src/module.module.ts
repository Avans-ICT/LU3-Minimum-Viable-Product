import { Module as NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ModuleController } from "./api/interface/module.controller";
import { ModuleService } from "./api/application/module.service";
import { ModuleRepository } from "./api/infrastructure/repositories/module.repository";
import { Module, ModuleSchema } from "./api/infrastructure/schemas/module.schema";

@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService, ModuleRepository],
})
export class ModulesModule {}