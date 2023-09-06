import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizRepository } from './quiz.repository';
import { Users } from '../users/users.entity';
import { StockService } from 'src/stock/stock.service';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly stockService: StockService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  // up, down 퀴즈 제출
  async createQuiz(user: Users, data: CreateQuizDto) {
    await this.quizRepository.createQuiz(user, data);

    return {
      statusCode: 201,
      message: '퀴즈제출 성공',
    };
  }
  // 퀴즈 확인
  async updateQuiz(): Promise<any> {
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;

    const quizId = await this.quizRepository.find({ where: { updated_date } });
    // console.log(quizId[0].id);
    console.log(quizId[0].user.id);

    for (const ele of quizId) {
      const id = ele.id;
      const quizUser = await this.quizRepository.findOne({
        where: { id },
      });

      // console.log(quizUser);
      const searchStock = await this.stockService.searchStock(quizUser.stockId);
      // console.log('stockId로 찾기', searchStock);
      const searchStockNumber = await this.stockService.getStockPrice(
        searchStock.data[0].id,
      );
      console.log(
        '코드명으로 찾기',
        searchStockNumber.stock.stockPrices[0].prdy_vrss_sign,
      );
      const stockAnswer = searchStockNumber.stock.stockPrices[0].prdy_vrss_sign;
      let upANDdownAnswer: string;
      if (stockAnswer === '1') {
        upANDdownAnswer = 'up';
      }
      if (stockAnswer === '2') {
        upANDdownAnswer = 'up';
      }
      if (stockAnswer === '3') {
        upANDdownAnswer = 'keep';
      }
      if (stockAnswer === '4') {
        upANDdownAnswer = 'down';
      }
      if (stockAnswer === '5') {
        upANDdownAnswer = 'down';
      }
      // keep 뜰 경우
      let newCorrect: string;
      if (upANDdownAnswer === 'keep') {
        newCorrect = 'keep';
      } else {
        if (quizUser.upANDdown === upANDdownAnswer) {
          newCorrect = 'true';
        } else {
          newCorrect = 'false';
        }
      }

      await this.quizRepository.updateQuiz(quizUser, {
        correct: newCorrect,
      });
    }

    return {
      statusCode: 201,
      message: '성공',
    };
  }

  // up 비율
  async upQuiz() {
    const upQ = await this.quizRepository.upQuiz();
    const downQ = await this.quizRepository.downQuiz();
    const sumQ = Number(upQ.count) + Number(downQ.count);
    const upPercent = (Number(upQ.count) / sumQ) * 100;

    return Math.round(upPercent);
  }

  // down 비율
  async downQuiz() {
    const upQ = await this.quizRepository.upQuiz();
    const downQ = await this.quizRepository.downQuiz();
    const sumQ = Number(upQ.count) + Number(downQ.count);
    const downPercent = (Number(downQ.count) / sumQ) * 100;

    return Math.round(downPercent);
  }

  // 퀴즈 확인 스케줄러 (시작)
  async startUpdateQuiz() {
    const job = new CronJob(
      '0 */60 18-19 * * 1-5',
      () => {
        console.log('start');
        this.updateQuiz();
      },
      null,
      false,
      'Asia/Seoul',
    );
    await this.schedulerRegistry.addCronJob('updateQuiz', job);
    job.start();
  }
  // 퀴즈 확인 스케줄러 (종료)
  async stopUpdateQuiz() {
    const job = await this.schedulerRegistry.getCronJob('updateQuiz');
    job.stop();
  }

  // stockId에 맞는 up 비율
  async upStockQuiz(stockId: string) {
    const upQ = await this.quizRepository.upStockQuiz(stockId);
    const downQ = await this.quizRepository.downStockQuiz(stockId);
    const sumQ = Number(upQ.count) + Number(downQ.count);
    const upPercent = (Number(upQ.count) / sumQ) * 100;

    return Math.round(upPercent);
  }

  // stockId에 맞는 down 비율
  async downStockQuiz(stockId: string) {
    const upQ = await this.quizRepository.upStockQuiz(stockId);
    const downQ = await this.quizRepository.downStockQuiz(stockId);
    const sumQ = Number(upQ.count) + Number(downQ.count);
    const downPercent = (Number(downQ.count) / sumQ) * 100;

    return Math.round(downPercent);
  }

  // 쿼리빌더 이용한 페이지네이션 구현
  async getUserQuiz(userId: number, page: number = 1) {
    const queryBuilder = await this.quizRepository.createQueryBuilder('q');
    if (userId) {
      queryBuilder.innerJoin('q.user', 'user').where('user.id = :id', {
        id: userId,
      });
    }

    const take = 5;
    const pageIndex: number = (page as any) > 0 ? parseInt(page as any) : 1;
    const total = await queryBuilder.getCount();

    queryBuilder.skip((pageIndex - 1) * take).take(take);

    return {
      data: await queryBuilder.getMany(),
      total,
      pageIndex,
      last_page: Math.ceil(total / take),
    };
  }
}
