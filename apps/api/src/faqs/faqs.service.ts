import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FAQ, Prisma } from '@prisma/client';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.FAQCreateInput): Promise<FAQ> {
    return this.prisma.fAQ.create({ data });
  }

  async findAll(): Promise<FAQ[]> {
    return this.prisma.fAQ.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
  }
}
