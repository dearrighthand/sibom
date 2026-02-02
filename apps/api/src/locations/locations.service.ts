import { Injectable, Logger } from '@nestjs/common';

export interface LocationItem {
  code: string;
  name: string;
}

interface LocationApiResponse {
  resultCode: string;
  resultMessage: string;
  data: LocationItem[];
}

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  private readonly API_KEY = process.env.LOCATION_API_KEY;
  private readonly ENDPOINT = 'https://kssc.mods.go.kr:8443/ksscNew_web/api/hj';

  // Fallback Data
  private readonly MOCK_PROVINCES = [
    { code: '11', name: '서울특별시' },
    { code: '26', name: '부산광역시' },
    // Add more typical provinces if needed for fallback
    { code: '41', name: '경기도' },
  ];

  private readonly MOCK_DISTRICTS: Record<string, LocationItem[]> = {
    '11': [
      { code: '11680', name: '강남구' },
      { code: '11650', name: '서초구' },
    ],
    '26': [
      { code: '26440', name: '강서구' },
      { code: '26350', name: '해운대구' },
    ],
    '41': [
      { code: '41130', name: '성남시' },
      { code: '41110', name: '수원시' },
    ],
  };

  async getProvinces(): Promise<LocationItem[]> {
    try {
      if (!this.API_KEY) throw new Error('No API Key');

      const url = `${this.ENDPOINT}/list.do?degree=20250101`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `API Error Status: ${response.status}, Body: ${errorText}`,
        );
        throw new Error(`API Error: ${response.status}`);
      }

      const data = (await response.json()) as LocationApiResponse;

      if (data.resultCode === '0000' && Array.isArray(data.data)) {
        return data.data;
      }

      this.logger.warn(
        `API returned unexpected format: ${JSON.stringify(data)}`,
      );
      return this.MOCK_PROVINCES;
    } catch (error) {
      const err = error as Error;
      this.logger.warn(
        `Failed to fetch provinces from API: ${err.message}. Using fallback data.`,
      );
      return this.MOCK_PROVINCES;
    }
  }

  async getDistricts(provinceCode: string): Promise<LocationItem[]> {
    try {
      if (!this.API_KEY) throw new Error('No API Key');

      const url = `${this.ENDPOINT}/list/${provinceCode}.do?degree=20250101`;

      const response = await fetch(url, {
        headers: {
          Authorization: this.API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `API Error Status: ${response.status}, Body: ${errorText}`,
        );
        throw new Error(`API Error: ${response.status}`);
      }

      const data = (await response.json()) as LocationApiResponse;

      if (data.resultCode === '0000' && Array.isArray(data.data)) {
        return data.data;
      }

      return this.getFallbackDistricts(provinceCode);
    } catch (error) {
      const err = error as Error;
      this.logger.warn(`Failed to fetch districts: ${err.message}`);
      return this.getFallbackDistricts(provinceCode);
    }
  }

  private getFallbackDistricts(provinceCode: string) {
    const districts = this.MOCK_DISTRICTS[provinceCode] || [];
    if (districts.length === 0 && provinceCode) {
      // Generic mock for others
      return [{ code: `${provinceCode}001`, name: '일반구' }];
    }
    return districts;
  }
}
