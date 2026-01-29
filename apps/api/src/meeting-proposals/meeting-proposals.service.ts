import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MeetingProposal, Prisma } from '@prisma/client';

@Injectable()
export class MeetingProposalsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.MeetingProposalCreateInput): Promise<MeetingProposal> {
        return this.prisma.meetingProposal.create({ data });
    }
}
