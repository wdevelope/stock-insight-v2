import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class NewsService {
  private readonly client_id = process.env.NAVER_Client_ID;
  private readonly client_secret = process.env.NAVER_Client_SECRET;
  private readonly api_url =
    'https://openapi.naver.com/v1/search/news?display=30&query=';

  constructor(private readonly httpService: HttpService) {
    console.log('Client ID:', this.client_id);
    console.log('Client Secret:', this.client_secret);
  }

  async searchBlog(query: string): Promise<AxiosResponse> {
    const url = `${this.api_url}${encodeURI(query)}`;
    const headers = {
      'X-Naver-Client-Id': this.client_id,
      'X-Naver-Client-Secret': this.client_secret,
    };

    return this.httpService.get(url, { headers }).toPromise();
  }
}
