import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AiServiceClient } from "../infrastructure/http/ai-service.client";
import { RecommendationEventDocument } from "../infrastructure/schemas/recommendation-event.schema";
import { RecommendationEventRepository } from "../infrastructure/repositories/recommendation-event.repository";

import { Module } from "../infrastructure/schemas/module.schema";

type RecommendationJobData = { eventId: string };

@Processor("recommendations")
export class RecommendationJobsProcessor extends WorkerHost {
  constructor(
    private readonly repo: RecommendationEventRepository,
    private readonly ai: AiServiceClient,

    @InjectModel(Module.name) private readonly moduleModel: Model<Module>,

    @InjectModel(RecommendationEventDocument.name)
    private readonly eventModel: Model<RecommendationEventDocument>,
  ) {
    super();
  }

  async process(job: Job<RecommendationJobData>) {
    const { eventId } = job.data;

    const event = await this.eventModel.findById(eventId);
    if (!event) return;

    try {
      const aiRes = await this.ai.recommend({
        requestId: event.request_id,
        sessionId: event.session_id,
        userId: String(event.user_id),
        k: event.k,
        input: {
          interestsText: event.input_interests_text,
          constraints: {
            location: event.constraints_location ?? undefined,
            level: event.constraints_level ?? undefined,
            studycreditsMin: event.constraints_studycredits_min ?? undefined,
            studycreditsMax: event.constraints_studycredits_max ?? undefined,
          },
        },
      });

      const mappedResults: Array<{
        module_id: any;
        rank: number;
        score: number;
        reasons?: Record<string, unknown>;
      }> = [];

      for (const r of aiRes.results) {
        const moduleId =
          (r as any).module_id ??
          (r as any).moduleId ??
          (r as any)._id;

        if (!moduleId) {
          throw new Error("AI result missing module_id/moduleId/_id");
        }

        // Optioneel: check dat module bestaat (handig om problemen vroeg te zien)
        const mod = await this.moduleModel.findById(moduleId, { _id: 1 }).lean();
        if (!mod?._id) throw new Error(`Module ${moduleId} not found`);

        mappedResults.push({
          module_id: mod._id,
          rank: r.rank,
          score: r.score,
          reasons: r.reasons ?? undefined,
        });
      }

      event.algorithm = aiRes.algorithm;
      event.model_version = aiRes.modelVersion;
      event.results = mappedResults as any;
      event.status = "COMPLETED";
      event.completed_at = new Date();
      event.error_message = undefined;

      await event.save();
    } catch (e: any) {
      event.status = "FAILED";
      event.completed_at = new Date();
      event.error_message = e?.message ?? String(e);
      await event.save();
      throw e;
    }
  }
}