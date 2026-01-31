import { Injectable, Logger } from '@nestjs/common';

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

  private readonly MOCK_DISTRICTS = {
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

  async getProvinces() {
    try {
      if (!this.API_KEY) throw new Error('No API Key');

      // GET /api/hj/list.do?degree=20250101
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

      const data = await response.json();

      // API returns { resultCode: "0000", resultMessage: "Success", data: [...] }
      if (data.resultCode === '0000' && Array.isArray(data.data)) {
        return data.data;
      }

      // If response format is unexpected
      this.logger.warn(
        `API returned unexpected format: ${JSON.stringify(data)}`,
      );
      return this.MOCK_PROVINCES;
    } catch (error) {
      this.logger.warn(
        `Failed to fetch provinces from API: ${error.message}. Using fallback data.`,
      );
      return this.MOCK_PROVINCES;
    }
  }

  async getDistricts(provinceCode: string) {
    try {
      if (!this.API_KEY) throw new Error('No API Key');

      // GET /api/hj/list/{highCode}.do?degree=20250101
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

      const data = await response.json();

      if (data.resultCode === '0000' && Array.isArray(data.data)) {
        return data.data;
      }

      return this.getFallbackDistricts(provinceCode);
    } catch (error) {
      this.logger.warn(`Failed to fetch districts: ${error.message}`);
      return this.getFallbackDistricts(provinceCode);
    }
  }

  private getFallbackDistricts(provinceCode: string) {
    const districts =
      this.MOCK_DISTRICTS[provinceCode as keyof typeof this.MOCK_DISTRICTS] ||
      [];
    if (districts.length === 0 && provinceCode) {
      // Generic mock for others
      return [{ code: `${provinceCode}001`, name: '일반구' }];
    }
    return districts;
  }
}
