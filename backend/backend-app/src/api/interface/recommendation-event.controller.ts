import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { CreateRecommendationEventDto } from "../domain/dtos/create-recommendation-event.dto";
import { RecommendationEventService } from "../application/recommendation-event.service";
import { Types } from "mongoose";

@Controller("recommendation-events")
export class RecommendationEventController {
  constructor(private readonly service: RecommendationEventService) {}

  @Post()
  async create(@Body() dto: CreateRecommendationEventDto) {
    return this.service.create(dto);
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid id format");
    }

    const event = await this.service.findById(id);
    if (!event) {
      throw new NotFoundException("RecommendationEvent not found");
    }
  return event;
}

  // Endpoint voor frontend: "laatste recommendation van user"
  @Get()
  async getLatestByUser(@Query("userId") userId?: string) {
    if (!userId) return null;
    return this.service.findLatestByUserId(userId);
  }
}