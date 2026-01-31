import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';

@Module({
  providers: [InquiriesService],
  exports: [InquiriesService],
})
export class InquiriesModule {}
