import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Inquiry, Prisma } from '@prisma/client';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
    return this.prisma.inquiry.create({ data });
  }
}
