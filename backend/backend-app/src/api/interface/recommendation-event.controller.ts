import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CsrfGuard } from "../../csrf-guard";

import { RecommendationEventService } from "../application/recommendation-event.service";
import { RequestRecommendationsDto } from "../domain/dtos/request-recommendations.dto";

@Controller("recommendation-events")
export class RecommendationEventController {
  constructor(private readonly service: RecommendationEventService) {}

  /**
   * Async request: creates a PENDING recommendation event and enqueues a job.
   *
   * Auth: cookie-based JWT via JwtStrategy + CSRF protection.
   * JwtStrategy.validate() returns: { userId, email }
   */
  @UseGuards(AuthGuard("jwt"), CsrfGuard)
  @Post("request")
  async request(@Req() req: any, @Body() dto: RequestRecommendationsDto) {
    const userId = req.user.userId; // <-- FIX: was req.user.id
    const event = await this.service.requestRecommendationsAsync(userId, dto);

    return {
      eventId: String(event._id),
      status: event.status,
    };
  }

  @UseGuards(AuthGuard("jwt"), CsrfGuard)
  @Get(":id")
  async getById(@Param("id") id: string) {
    const event = await this.service.getEventById(id);
    return event;
  }
}