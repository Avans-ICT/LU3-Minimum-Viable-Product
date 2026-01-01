import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './api/interface/auth.controller';
import { ModuleController } from './api/interface/module.controller';
import { AuthService } from './api/application/auth.service';
import { ModuleService } from './api/application/module.service';
import { AuthRepository } from './api/infrastructure/auth.repository';
import { ModuleRepository } from './api/infrastructure/module.repository';
import { Module as ModuleEntity, ModuleSchema } from './api/domain/module.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModuleEntity.name, schema: ModuleSchema },
    ]),
  ],
  controllers: [AuthController, ModuleController],
  providers: [AuthService, ModuleService, AuthRepository, ModuleRepository],
})
export class AuthModule {}