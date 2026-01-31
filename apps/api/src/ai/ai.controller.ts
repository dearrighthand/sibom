import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('refine')
  async refine(@Body('text') text: string) {
    if (!text) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.aiService.refineText(text);
      return { result };
    } catch (error) {
      throw new HttpException(
        'Failed to generate content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
