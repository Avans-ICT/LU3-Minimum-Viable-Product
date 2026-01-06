import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('Validation');

    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.logger.error(`Validation failed for ${request.url}: ${JSON.stringify(exception.getResponse())}`);

        response.status(status).json(exception.getResponse());
    }
}