import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService, LocationItem } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('provinces')
  async getProvinces(): Promise<LocationItem[]> {
    return this.locationsService.getProvinces();
  }

  @Get('districts')
  async getDistricts(
    @Query('provinceCode') provinceCode: string,
  ): Promise<LocationItem[]> {
    return this.locationsService.getDistricts(provinceCode);
  }
}
