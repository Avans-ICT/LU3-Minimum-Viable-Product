import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AiRecommendationRequestDto } from "../../domain/dtos/ai-recommendation-request.dto";
import { AiRecommendationResponseDto } from "../../domain/dtos/ai-recommendation-response.dto";

@Injectable()
export class AiServiceClient {
  constructor(private readonly http: HttpService) {}

  private get baseUrl() {
    const url = process.env.AI_SERVICE_URL;
    if (!url) throw new Error("AI_SERVICE_URL is not set");
    return url;
  }

  private get apiKey() {
    const key = process.env.AI_SERVICE_API_KEY;
    if (!key) throw new Error("AI_SERVICE_API_KEY is not set");
    return key;
  }

  async recommend(
    payload: AiRecommendationRequestDto,
  ): Promise<AiRecommendationResponseDto> {
    try {
      const res$ = this.http.post<AiRecommendationResponseDto>(
        `${this.baseUrl}/recommendations`,
        payload,
        {
          headers: { "X-API-Key": this.apiKey },
          timeout: 15000,
        },
      );

      const res = await firstValueFrom(res$);
      return res.data;
    } catch {
      throw new ServiceUnavailableException("AI service unavailable");
    }
  }
}