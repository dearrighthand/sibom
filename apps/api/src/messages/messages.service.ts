import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.MessageCreateInput): Promise<Message> {
        return this.prisma.message.create({ data });
    }
}
