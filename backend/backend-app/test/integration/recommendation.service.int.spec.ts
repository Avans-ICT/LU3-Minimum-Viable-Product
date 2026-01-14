import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { RecommendationEventService } from '../../src/api/application/recommendation-event.service';
import { RecommendationEventRepository } from '../../src/api/infrastructure/repositories/recommendation-event.repository';
import { RecommendationFeedbackRepository } from '../../src/api/infrastructure/repositories/recommendation-feedback.repository';
import { RecommendationEventDocument, RecommendationEventSchema } from '../../src/api/infrastructure/schemas/recommendation-event.schema';
import { RecommendationFeedbackDocument, RecommendationFeedbackSchema } from '../../src/api/infrastructure/schemas/recommendation-feedback.schema';
import { AiServiceClient } from '../../src/api/infrastructure/http/ai-service.client';
import { getConnectionToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

describe('RecommendationEventService', () => {
    let service: RecommendationEventService;
    let connection: Connection;
    let eventModel: Model<RecommendationEventDocument>;
    let feedbackModel: Model<RecommendationFeedbackDocument>;
    let mongo: MongoMemoryServer;

    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongo.getUri()),
                MongooseModule.forFeature([
                    { name: RecommendationEventDocument.name, schema: RecommendationEventSchema },
                    { name: RecommendationFeedbackDocument.name, schema: RecommendationFeedbackSchema },
                ]),
            ],
            providers: [
                RecommendationEventService,
                RecommendationEventRepository,
                RecommendationFeedbackRepository,
                {
                    provide: 'BullQueue_recommendations',
                    useValue: { add: jest.fn() }, // mock queue
                },
                {
                    provide: AiServiceClient,
                    useValue: { recommend: jest.fn().mockResolvedValue({ algorithm: 'mock', modelVersion: 'v1', results: [] }) },
                },
            ],
        }).compile();

        service = module.get<RecommendationEventService>(RecommendationEventService);

        eventModel = module.get(getModelToken(RecommendationEventDocument.name));
        feedbackModel = module.get(getModelToken(RecommendationFeedbackDocument.name));
        connection = module.get<Connection>(getConnectionToken());
    });

    afterEach(async () => {
        await connection.db!.dropDatabase();
    });

    afterAll(async () => {
        await connection.close();
        await mongo.stop();
    });

    it('should allow feedback submission for a completed event', async () => {
        const userId = new Types.ObjectId();
        const moduleId1 = new Types.ObjectId();
        const moduleId2 = new Types.ObjectId();

        // Maak een COMPLETED event
        const event = await eventModel.create({
            event_type: 'recommendation_created',
            user_id: userId,
            session_id: 'sess-123',
            request_id: 'req-1',
            algorithm: 'mocked',
            model_version: 'v1',
            k: 2,
            input_interests_text: 'chemie',
            status: 'COMPLETED',
            results: [
                { module_id: moduleId1, rank: 1, score: 0.9 },
                { module_id: moduleId2, rank: 2, score: 0.8 },
            ],
        });

        // Feedback DTO
        const feedbackDto = {
            sessionId: 'sess-123',
            items: [
                { moduleId: moduleId1.toString(), feedbackType: 'RELEV', value: 1 },
                { moduleId: moduleId2.toString(), feedbackType: 'RELEV', value: 2 },
            ],
        };

        const result = await service.submitFeedback(userId.toString(), event._id.toString(), feedbackDto);
        expect(result.insertedCount).toBe(2);

        // Check in DB
        const saved = await feedbackModel.find({ event_id: event._id });
        expect(saved).toHaveLength(2);
        expect(saved.map(f => String(f.module_id))).toEqual(expect.arrayContaining([moduleId1.toString(), moduleId2.toString()]));
    });

    it('should create a pending recommendation event and enqueue a job', async () => {
        const userId = new Types.ObjectId().toString();
        const dto = {
            sessionId: 'sess-456',
            requestId: 'req-2',
            k: 3,
            inputInterestsText: 'biologie',
        };

        const event = await service.requestRecommendationsAsync(userId, dto);
        expect(event.status).toBe('PENDING');
        expect(event.user_id.toString()).toBe(userId);
        expect(event.k).toBe(3);
        expect(event.input_interests_text).toBe('biologie');
    });

    it('should throw ConflictException if requestId is already used', async () => {
        const userId = new Types.ObjectId().toString();
        const dto = {
            sessionId: 'sess-789',
            requestId: 'req-duplicate',
            k: 2,
            inputInterestsText: 'natuurkunde',
        };

        await service.requestRecommendationsAsync(userId, dto);

        await expect(service.requestRecommendationsAsync(userId, dto))
            .rejects
            .toThrow(ConflictException);
    });

    it('should not allow feedback for PENDING events', async () => {
        const userId = new Types.ObjectId();
        const moduleId = new Types.ObjectId();

        const event = await eventModel.create({
            event_type: 'recommendation_created',
            user_id: userId,
            session_id: 'sess-999',
            request_id: 'req-3',
            algorithm: 'mocked',
            model_version: 'v1',
            k: 1,
            input_interests_text: 'scheikunde',
            status: 'PENDING',
            results: [{ module_id: moduleId, rank: 1, score: 0.5 }],
        });

        const feedbackDto = {
            sessionId: 'sess-999',
            items: [{ moduleId: moduleId.toString(), feedbackType: 'RELEV', value: 1 }],
        };

        await expect(service.submitFeedback(userId.toString(), event._id.toString(), feedbackDto))
            .rejects
            .toThrow(BadRequestException);
    });

    it('should not allow feedback for PENDING events', async () => {
        const userId = new Types.ObjectId();
        const moduleId = new Types.ObjectId();

        const event = await eventModel.create({
            event_type: 'recommendation_created',
            user_id: userId,
            session_id: 'sess-999',
            request_id: 'req-3',
            algorithm: 'mocked',
            model_version: 'v1',
            k: 1,
            input_interests_text: 'scheikunde',
            status: 'PENDING',
            results: [{ module_id: moduleId, rank: 1, score: 0.5 }],
        });

        const feedbackDto = {
            sessionId: 'sess-999',
            items: [{ moduleId: moduleId.toString(), feedbackType: 'RELEV', value: 1 }],
        };

        await expect(service.submitFeedback(userId.toString(), event._id.toString(), feedbackDto))
            .rejects
            .toThrow(BadRequestException);
    });

    it('should throw ConflictException if feedback already submitted for this event', async () => {
        const userId = new Types.ObjectId();
        const moduleId = new Types.ObjectId();

        const event = await eventModel.create({
            event_type: 'recommendation_created',
            user_id: userId,
            session_id: 'sess-222',
            request_id: 'req-5',
            algorithm: 'mocked',
            model_version: 'v1',
            k: 1,
            input_interests_text: 'informatica',
            status: 'COMPLETED',
            results: [{ module_id: moduleId, rank: 1, score: 0.7 }],
        });

        const feedbackDto = {
            sessionId: 'sess-222',
            items: [{ moduleId: moduleId.toString(), feedbackType: 'RELEV', value: 1 }],
        };

        await service.submitFeedback(userId.toString(), event._id.toString(), feedbackDto);

        await expect(service.submitFeedback(userId.toString(), event._id.toString(), feedbackDto))
            .rejects
            .toThrow(ConflictException);
    });
});