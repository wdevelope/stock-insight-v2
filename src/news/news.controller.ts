import { Controller, Get, Query, Res } from '@nestjs/common';
import { NewsService } from './news.service';
import { Response } from 'express';

@Controller('search/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async searchNews(@Query('query') query: string, @Res() res: Response) {
    try {
      const response = await this.newsService.searchNews(query);
      res.status(response.status).json(response.data);
    } catch (error) {
      res.status(error.response?.status || 500).send(error.response?.data);
    }
  }
}
