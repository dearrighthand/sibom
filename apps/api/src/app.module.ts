import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MatchesModule } from './matches/matches.module';
import { MessagesModule } from './messages/messages.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { MeetingProposalsModule } from './meeting-proposals/meeting-proposals.module';
import { FaqsModule } from './faqs/faqs.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    MatchesModule,
    MessagesModule,
    SubscriptionsModule,
    MeetingProposalsModule,
    FaqsModule,
    InquiriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
