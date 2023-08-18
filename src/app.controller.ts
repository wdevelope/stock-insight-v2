import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get('/login')
  getRoot(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'views', 'login.html'));
  }

  @Get('/main')
  getMain(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'views', 'index.html'),
    );
  }

  @Get('/search')
  getSearch(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'views', 'search.html'),
    );
  }

  @Get('/news')
  getNews(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'views', 'news.html'),
    );
  }

  @Get('/stocks')
  getStocks(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'views', 'stock.html'),
    );
  }

  @Get('/community')
  getCommunity(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'views', 'community.html'),
    );
  }

  @Get('/community/board')
  getBoard(@Res() res: Response) {
    return res.sendFile(
      join(__dirname, '..', '..', 'public', 'views', 'board.html'),
    );
  }
}
