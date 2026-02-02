import { Controller, Get, Post, Query, Body, Request } from '@nestjs/common';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('recommendations')
  async getRecommendations(
    @Query('userId') userId: string,
    @Query('ageMin') ageMin?: string,
    @Query('ageMax') ageMax?: string,
    @Query('distance') distance?: string,
    @Query('interestCodes') interestCodes?: string,
    @Query('skipAi') skipAi?: string,
  ) {
    return this.matchesService.getRecommendations(
      userId,
      ageMin ? parseInt(ageMin) : undefined,
      ageMax ? parseInt(ageMax) : undefined,
      distance,
      interestCodes ? interestCodes.split(',') : undefined,
      skipAi === 'true',
    );
  }

  @Get('received')
  async getReceivedLikes(@Query('userId') userId: string) {
    return this.matchesService.getReceivedLikes(userId);
  }

  @Get('sent')
  async getSentLikes(@Query('userId') userId: string) {
    return this.matchesService.getSentLikes(userId);
  }

  @Post('like')
  async like(@Body() body: { userId: string; receiverId: string }) {
    return this.matchesService.like(body.userId, body.receiverId);
  }

  @Post('pass')
  async pass(@Body() body: { userId: string; receiverId: string }) {
    return this.matchesService.pass(body.userId, body.receiverId);
  }

  @Post('report')
  async report(
    @Body() body: { userId: string; targetId: string; reason: string },
  ) {
    return this.matchesService.report(body.userId, body.targetId, body.reason);
  }

  @Post('block')
  async block(@Body() body: { userId: string; targetId: string }) {
    return this.matchesService.block(body.userId, body.targetId);
  }

  @Post('leave')
  async leave(@Body() body: { userId: string; matchId: string }) {
    return this.matchesService.leaveChat(body.userId, body.matchId);
  }
}
