import { Module as NestModule, MiddlewareConsumer } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ModuleController } from "./api/interface/module.controller";
import { ModuleService } from "./api/application/module.service";
import { ModuleRepository } from "./api/infrastructure/repositories/module.repository";
import { Module, ModuleSchema } from "./api/infrastructure/schemas/module.schema";
import { LoggerMiddleware } from "./api/middleware/logger";

@NestModule({
  imports: [
    MongooseModule.forFeature([{ name: Module.name, schema: ModuleSchema }]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService, ModuleRepository],
})
export class ModulesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(ModuleController);
  }
}