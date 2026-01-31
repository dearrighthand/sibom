import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('provinces')
  async getProvinces() {
    return this.locationsService.getProvinces();
  }

  @Get('districts')
  async getDistricts(@Query('provinceCode') provinceCode: string) {
    return this.locationsService.getDistricts(provinceCode);
  }
}
