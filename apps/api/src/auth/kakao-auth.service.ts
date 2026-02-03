import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class KakaoAuthService {
  async getAccessToken(code: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://kauth.kakao.com/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID || '',
          redirect_uri: process.env.KAKAO_REDIRECT_URI || '',
          code,
          ...(process.env.KAKAO_CLIENT_SECRET ? { client_secret: process.env.KAKAO_CLIENT_SECRET } : {}),
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Kakao token exchange failed:', error.response?.data || error.message);
      throw new UnauthorizedException('Failed to get Kakao access token');
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid Kakao token');
    }
  }
}
