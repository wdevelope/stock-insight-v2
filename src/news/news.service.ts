import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class NewsService {
  private readonly client_id = process.env.NAVER_Client_ID;
  private readonly client_secret = process.env.NAVER_Client_SECRET;
  private readonly api_url =
    'https://openapi.naver.com/v1/search/news?display=30';

  constructor(private readonly httpService: HttpService) {}

  async searchNews(query: string, page: number = 1): Promise<AxiosResponse> {
    const start = (page - 1) * 30 + 1; // 페이지가 1인 경우 start는 1, 페이지가 2인 경우 start는 31
    const url = `${this.api_url}&query=${encodeURI(
      query,
    )}&sort=sim&start=${start}`;
    const headers = {
      'X-Naver-Client-Id': this.client_id,
      'X-Naver-Client-Secret': this.client_secret,
    };

    return this.httpService.get(url, { headers }).toPromise();
  }
}
