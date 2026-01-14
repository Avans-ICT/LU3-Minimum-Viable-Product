import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/api/application/auth.service';
import { AuthRepository } from '../../src/api/infrastructure/repositories/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../src/api/infrastructure/schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as argon2 from 'argon2';

describe('AuthService (integration)', () => {
    let authService: AuthService;
    let mongo: MongoMemoryServer;
    let authRepository: AuthRepository;
    let connection: Connection;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongo.getUri()),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
                JwtModule.register({
                    secret: 'test-secret',
                    signOptions: { expiresIn: '1h' },
                }),
            ],
            providers: [AuthService, AuthRepository],
        }).compile();
        authService = module.get(AuthService);
        authRepository = module.get(AuthRepository);
        connection = module.get<Connection>(getConnectionToken());
    });

    afterEach(async () => {
        await connection.db!.dropDatabase();
    })

    afterAll(async () => {
        await connection.close();
        await mongo.stop();
    });

    //registeren en kijken of we de tokens terug krijgen, en dan inloggen en tokens terug krijgen met het nu bestaande account
    it('registers and logs in a user', async () => {
        const registerResult = await authService.register({
            email: 'test@test.com',
            password: 'password123',
            profile: {
                firstName: 'joep',
                lastName: 'jaap'
            }
        });

        expect(registerResult.accessToken).toBeDefined();
        expect(registerResult.refreshToken).toBeDefined();

        const loginResult = await authService.login({
            email: 'test@test.com',
            password: 'password123',
        });

        expect(loginResult.accessToken).toBeDefined();
        expect(loginResult.refreshToken).toBeDefined();
    });

    //checken of een wachtwoord gehasht is door argon na een register
    it('hashes password before saving', async () => {
        await authService.register({
            email: 'hash@test.com',
            password: 'plain-text',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
      
        });

        const user = await authRepository.findByEmail('hash@test.com');
        if (user) {
            expect(user.password).not.toBe('plain-text');
            const valid = await argon2.verify(user.password, 'plain-text');
            expect(valid).toBe(true);
        }
    });

    //checken of het mogelijk is 2 keer een email op te slaan met de register
    it('throws error on duplicate email registration', async () => {
        await authService.register({
            email: 'dup@test.com',
            password: '123',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
        });

        await expect(
            authService.register({
                email: 'dup@test.com',
                password: '123',
                profile: {
                    firstName: 'a',
                    lastName: 'b',
                }
            }),
        ).rejects.toThrow();
    });

    //checken of ingelogd kan worden met verkeerde wachtwoorden
    it('rejects login with invalid password', async () => {
        await authService.register({
            email: 'login@test.com',
            password: 'correct',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
        });

        await expect(
            authService.login({
                email: 'login@test.com',
                password: 'wrong',
            }),
        ).rejects.toThrow();
    });

    //checken of we in kunnen loggen met een account dat niet bestaat
    it('rejects login for non-existing user', async () => {
        await expect(
            authService.login({
                email: 'missing@test.com',
                password: '123',
            }),
        ).rejects.toThrow();
    });

    //checken of onze refreshtokens ook gehasht worden door argon omdat die ook gevoelig zijn
    it('stores hashed refresh token', async () => {
        const { refreshToken } = await authService.register({
            email: 'refresh@test.com',
            password: '123',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
        });

        const user = await authRepository.findByEmail('refresh@test.com');

        if (user) {
            expect(user.refreshToken).toBeDefined();
            expect(user.refreshToken).not.toBe(refreshToken);
        }
    });

    //checken of refreshtokens correct token refreshen worden
    it('refreshes tokens correctly', async () => {
        const { refreshToken } = await authService.register({
            email: 'rotate@test.com',
            password: '123',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
        });

        const result = await authService.refresh(refreshToken);

        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });

    //checken of refreshToken uit db wordt verwijderd na uitloggen
    it('clears refresh token on logout', async () => {
        const { refreshToken } = await authService.register({
            email: 'logout@test.com',
            password: '123',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
        });

        expect(refreshToken).toBeDefined();

        const user = await authRepository.findByEmail('logout@test.com');

        if (user) {
            await authService.logout(user.id.toString());

            const updated = await authRepository.findById(user.id.toString());
            if (updated)
                expect(updated.refreshToken).toBeNull();
        }
    });

    //checken of JWT tokens correct zijn gecodeerd
    it('creates valid JWT payload', async () => {
        const { accessToken } = await authService.register({
            email: 'jwt@test.com',
            password: '123',
            profile: {
                firstName: 'a',
                lastName: 'b',
            }
        });

        const decoded = jwt.decode(accessToken) as any;

        expect(decoded.sub).toBeDefined();
        expect(decoded.email).toBe('jwt@test.com');
    });

    //checken of profiel bestaat bij gebruikers die net geregistreerd zijn
    it('returns profile for existing user', async () => {
        await authService.register({
            email: 'profile@test.com',
            password: 'password123',
            profile: { firstName: 'Jan', lastName: 'Jansen' }
        });

        const user = await authRepository.findByEmail('profile@test.com');
        const profile = await authService.getProfile(user!.id);

        expect(profile.firstName).toBe('Jan');
        expect(profile.lastName).toBe('Jansen');
    });

    //profile moet niet bestaan bij niet bestaande gebruiker
    it('throws NotFoundException when profile does not exist', async () => {
        await expect(
            authService.getProfile('507f191e810c19729de860ea')
        ).rejects.toThrow();
    });

    //profiel moet correct updaten goede input
    it('updates profile fields correctly', async () => {
        await authService.register({
            email: 'change@test.com',
            password: 'password123',
            profile: { firstName: 'A', lastName: 'B' }
        });

        const user = await authRepository.findByEmail('change@test.com');

        await authService.changeProfile(
            { interests: 'AI, software', location: 'Breda', studycredits: 15 },
            user!.id
        );

        const updatedProfile = await authService.getProfile(user!.id);
        expect(updatedProfile.interests).toBe('AI, software');
        expect(updatedProfile.location).toBe('Breda');
    });

    //checken of ongeldige tokens geaccepteerd worden bij een refresh 
    it('rejects refresh with invalid token', async () => {
        await expect(
            authService.refresh('invalid.token.here')
        ).rejects.toThrow();
    });

    //kijken of oude refreshtoken erin mag na een refresh
    it('rejects refresh with old refresh token after rotation', async () => {
        const { refreshToken } = await authService.register({
            email: 'rotate2@test.com',
            password: 'password123',
            profile: { firstName: 'A', lastName: 'B' }
        });

        const firstRefresh = await authService.refresh(refreshToken);

        await expect(
            authService.refresh(refreshToken)
        ).rejects.toThrow();
    });

    //kijken of er uitgelogd word zonder userId
    it('does not throw when logout is called without userId', async () => {
        await expect(authService.logout()).resolves.not.toThrow();
    });
});