import { Test, TestingModule } from '@nestjs/testing';
import { ModuleService } from '../../src/api/application/module.service';
import { ModuleRepository } from '../../src/api/infrastructure/repositories/module.repository';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Module, ModuleSchema } from '../../src/api/infrastructure/schemas/module.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Types } from 'mongoose';

describe('ModuleService (integration)', () => {
    let moduleService: ModuleService;
    let moduleRepository: ModuleRepository;
    let connection: Connection;
    let mongo: MongoMemoryServer;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongo.getUri()),
                MongooseModule.forFeature([
                    { name: Module.name, schema: ModuleSchema },
                ]),
            ],
            providers: [ModuleService, ModuleRepository],
        }).compile();

        moduleService = module.get(ModuleService);
        moduleRepository = module.get(ModuleRepository);
        connection = module.get<Connection>(getConnectionToken());
    });

    afterEach(async () => {
        await connection.db!.dropDatabase();
    });

    afterAll(async () => {
        await connection.close();
        await mongo.stop();
    });

    //module ophalen
    it('fetches a module by ID', async () => {
        const moduleDoc = await connection.collection('modules').insertOne({ name: 'Test Module' });
        const fetched = await moduleService.getModuleById(moduleDoc.insertedId.toString());
        expect(fetched.name).toBe('Test Module');
    });

    //alle modules ophalen
    it('fetches all modules', async () => {
        await connection.collection('modules').insertMany([{ name: 'M1' }, { name: 'M2' }]);
        const all = await moduleService.getAllModules();
        expect(all).toHaveLength(2);
    });

    //meerdere modules ophalen per id in een batch
    it('fetches modules by batch of IDs', async () => {
        const m1 = await connection.collection('modules').insertOne({ name: 'M1' });
        const m2 = await connection.collection('modules').insertOne({ name: 'M2' });

        const batch = await moduleService.getModulesByIds([m1.insertedId.toString(), m2.insertedId.toString()]);
        expect(batch.map(m => m.name)).toEqual(expect.arrayContaining(['M1', 'M2']));
    });

    //niet bestaande modules geven error
    it('throws NotFoundException for non-existent module', async () => {
        const fakeId = new Types.ObjectId().toString();
        await expect(moduleService.getModuleById(fakeId)).rejects.toThrow();
    });
});