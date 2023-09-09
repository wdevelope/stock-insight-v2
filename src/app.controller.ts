import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class AppController {
  // @Get(':pageName')
  // renderPage(@Param('pageName') pageName: string, @Res() res: Response) {
  //   res.sendFile(join(process.cwd(), 'src', 'view', `${pageName}.html`));
  // }
  @Get()
  renderHomePage(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'login.html'));
  }

  @Get('askBoard')
  renderAskBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'askBoard.html'));
  }

  @Get('askBoardInfo')
  renderAskBoardInfo(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'askBoardInfo.html'));
  }

  @Get('askBoardReply')
  renderAskBoardReply(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'askBoardReply.html'));
  }

  @Get('askWriteBoard')
  renderAskWriteBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'askWriteBoard.html'));
  }

  @Get('freeBoard')
  renderFreeBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'freeBoard.html'));
  }

  @Get('freeboardInfo')
  renderFreeboardInfo(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'freeboardInfo.html'));
  }

  @Get('freeEditBoard')
  renderFreeEditBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'freeEditBoard.html'));
  }

  @Get('freeWriteBoard')
  renderFreeWriteBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'freeWriteBoard.html'));
  }

  @Get('news')
  renderNews(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'news.html'));
  }

  @Get('noticeBoard')
  renderNoticeBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'noticeBoard.html'));
  }

  @Get('noticeBoardInfo')
  renderNoticeBoardInfo(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'noticeBoardInfo.html'));
  }

  @Get('noticeWriteBoard')
  renderNoticeWriteBoard(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'noticeWriteBoard.html'));
  }

  @Get('quiz')
  renderQuiz(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'quiz.html'));
  }

  @Get('stocks')
  renderStocks(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'stocks.html'));
  }

  @Get('stocksInfo')
  renderStocksInfo(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'stocksInfo.html'));
  }

  @Get('stocksLike')
  renderStocksLike(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'stocksLike.html'));
  }

  @Get('stocksRank')
  renderStocksRank(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'stocksRank.html'));
  }

  @Get('userInfo')
  renderUserInfo(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'userInfo.html'));
  }

  @Get('index')
  renderndex(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'src', 'view', 'index.html'));
  }
}
