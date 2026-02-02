import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { HOBBY_MAPPING } from '@sibom/shared';

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('refine')
  async refine(@Body('text') text: string) {
    if (!text) {
      throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const result = await this.aiService.refineText(text);
      return { result };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Failed to generate content',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('chat-suggestions')
  async chatSuggestions(
    @Body()
    body: {
      userId: string;
      partnerId: string;
      type: 'START' | 'REPLY' | 'PROPOSE' | 'EMOTION';
      history?: { sender: string; content: string }[];
    },
  ) {
    const { userId, partnerId, type, history = [] } = body;

    const userProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    const partnerProfile = await this.prisma.profile.findUnique({
      where: { userId: partnerId },
    });

    if (!userProfile || !partnerProfile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    // Translate interests
    const translate = (interests: string[]) =>
      interests.map((i) => HOBBY_MAPPING[i] || i);

    const userProfileForAI = {
      ...userProfile,
      interests: translate(userProfile.interests),
    };
    const partnerProfileForAI = {
      ...partnerProfile,
      interests: translate(partnerProfile.interests),
    };

    try {
      const suggestions = await this.aiService.generateChatSuggestions(
        userProfileForAI,
        partnerProfileForAI,
        history,
        type,
      );
      return { suggestions };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'AI suggestion failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
