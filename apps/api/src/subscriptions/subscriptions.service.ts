import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription, Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
        return this.prisma.subscription.create({ data });
    }
}
