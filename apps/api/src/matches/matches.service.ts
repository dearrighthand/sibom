import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Match, Prisma } from '@prisma/client';

@Injectable()
export class MatchesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.MatchCreateInput): Promise<Match> {
        return this.prisma.match.create({ data });
    }
}
