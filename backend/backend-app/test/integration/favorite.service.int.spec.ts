import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from '../../src/api/application/favorite.service';
import { FavoriteRepository } from '../../src/api/infrastructure/repositories/favorite.repository';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../../src/api/infrastructure/schemas/user.schema';
import { Module, ModuleSchema } from '../../src/api/infrastructure/schemas/module.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Types } from 'mongoose';

describe('FavoriteService (integration)', () => {
    let favoriteService: FavoriteService;
    let favoriteRepository: FavoriteRepository;
    let connection: Connection;
    let mongo: MongoMemoryServer;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongo.getUri()),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                    { name: Module.name, schema: ModuleSchema },
                ]),
            ],
            providers: [FavoriteService, FavoriteRepository],
        }).compile();

        favoriteService = module.get(FavoriteService);
        favoriteRepository = module.get(FavoriteRepository);
        connection = module.get<Connection>(getConnectionToken());
    });

    afterEach(async () => {
        await connection.db!.dropDatabase();
    });

    afterAll(async () => {
        await connection.close();
        await mongo.stop();
    });

    //kan favoriete toevoegen
    it('adds a favorite module to a user', async () => {
        const user = await connection.collection('users').insertOne({ email: 'u@test.com', favorites: [] });
        const moduleId = new Types.ObjectId();
        await connection.collection('modules').insertOne({ _id: moduleId, name: 'Module 1' });

        const result = await favoriteService.addFavorite(user.insertedId.toString(), moduleId.toString());
        expect(result).toBe('succes');

        const updatedUser = await favoriteRepository.getFavorites(user.insertedId.toString());
        expect(updatedUser).toContain(moduleId.toString());
    });

    //favoriete verwijderen
    it('removes a favorite module from a user', async () => {
        const moduleId = new Types.ObjectId();
        const user = await connection.collection('users').insertOne({ email: 'u@test.com', favorites: [moduleId] });
        await connection.collection('modules').insertOne({ _id: moduleId, name: 'Module 1' });

        const result = await favoriteService.removeFavorite(user.insertedId.toString(), moduleId.toString());
        expect(result).toBe('succes');

        const favorites = await favoriteRepository.getFavorites(user.insertedId.toString());
        expect(favorites).not.toContain(moduleId.toString());
    });

    //fout bij nietbestaande module bij toevoegen
    it('throws NotFoundException if module does not exist on ins', async () => {
        const user = await connection.collection('users').insertOne({ email: 'u@test.com', favorites: [] });
        const fakeModuleId = new Types.ObjectId().toString();

        await expect(favoriteService.addFavorite(user.insertedId.toString(), fakeModuleId)).rejects.toThrow();
    });

    //fout bij nietbestaande module bij verwijderen
    it('throws NotFoundException if module does not exist on delete', async () => {
        const user = await connection.collection('users').insertOne({ email: 'u@test.com', favorites: [] });
        const fakeModuleId = new Types.ObjectId().toString();

        await expect(favoriteService.removeFavorite(user.insertedId.toString(), fakeModuleId)).rejects.toThrow();
    });

    //favorieten ophalen
    it('retrieves favorites of a user', async () => {
        const moduleId1 = new Types.ObjectId();
        const moduleId2 = new Types.ObjectId();
        const user = await connection.collection('users').insertOne({ email: 'u@test.com', favorites: [moduleId1, moduleId2]});
        const favorites = await favoriteService.getFavorites(user.insertedId.toString());
        const favoriteStrings = favorites.map(id => id.toString());

        expect(favoriteStrings.sort()).toStrictEqual([moduleId1.toString(), moduleId2.toString()].sort());
    });
});
