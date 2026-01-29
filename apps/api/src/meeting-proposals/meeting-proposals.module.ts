import { Module } from '@nestjs/common';
import { MeetingProposalsService } from './meeting-proposals.service';

@Module({
    providers: [MeetingProposalsService],
    exports: [MeetingProposalsService],
})
export class MeetingProposalsModule { }
