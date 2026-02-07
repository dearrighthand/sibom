import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Post('device-token')
  @ApiOperation({ summary: 'Update device token for push notifications' })
  async updateDeviceToken(@Request() req, @Body() body: { token: string }) {
    return this.usersService.updateDeviceToken(req.user.id, body.token);
  }
}
