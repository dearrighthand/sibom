import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('rooms')
  async getRooms(@Query('userId') userId: string) {
    return this.messagesService.getRooms(userId);
  }

  @Get(':matchId')
  async getMessages(
    @Param('matchId') matchId: string,
    @Query('userId') userId: string,
  ) {
    return this.messagesService.getMessages(matchId, userId);
  }

  @Post()
  async sendMessage(
    @Body() body: { userId: string; matchId: string; content: string },
  ) {
    return this.messagesService.sendMessage(
      body.userId,
      body.matchId,
      body.content,
    );
  }
}
