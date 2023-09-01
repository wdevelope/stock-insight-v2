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
  // up, down, keep 세가지
  async createQuiz(user: Users, data: CreateQuizDto) {
    await this.quizRepository.createQuiz(user, data);

    return {
      statusCode: 201,
      message: '퀴즈제출 성공',
    };
  }
  // 퀴즈 확인
  async updateQuiz(id: number): Promise<any> {
    const quizUser = await this.quizRepository.findOne({
      where: { id },
    });
    // console.log(quizUser);
    const searchStock = await this.stockService.searchStock(quizUser.stockName);
    // console.log('이름으로 찾기', searchStock.data[0].id);
    const searchStockNumber = await this.stockService.getStockPrice(
      searchStock.data[0].id,
    );
    // console.log(
    //   '코드명으로 찾기',
    //   searchStockNumber.stock.stockPrices[0].prdy_vrss_sign,
    // );
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

    let newAnswer: boolean;
    if (quizUser.upANDdown === upANDdownAnswer) {
      newAnswer = true;
    } else {
      newAnswer = false;
    }

    await this.quizRepository.updateQuiz(quizUser, {
      answer: newAnswer,
    });

    return {
      statusCode: 201,
      message: '성공',
    };
  }

  // up down 페이지네이션
  async findNumberByupANDdown(
    upANDdown: string,
    page: number = 1,
  ): Promise<any> {
    const take = 20; //페이지 상에서 보일 개수(LIMIT)
    const [quizUpAndDown, total] = await this.quizRepository.findAndCount({
      take,
      skip: (page - 1) * take, //skip이 OFFSET
      where: { upANDdown },
    });

    return {
      data: quizUpAndDown.map((quiz) => {
        const {
          id,
          answer,
          user,
          stock,
          createdAt,
          updatedAt,
          deletedAt,
          ...data
        } = quiz;

        return data;
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }

  // up, down 각각의 개수의 합
  async getQuiz() {
    return await this.quizRepository.getQuiz();
  }

  async getPercentQuiz() {
    const getQuiz = await this.quizRepository.getQuiz();

    // console.log('string', getQuiz[0].sum + getQuiz[1].sum);
    // console.log('Number', Number(getQuiz[0].sum) + Number(getQuiz[1].sum));
    const downQuiz = Number(getQuiz[0].sum);
    const upQuiz = Number(getQuiz[1].sum);
    const sum = Number(getQuiz[0].sum) + Number(getQuiz[1].sum);

    const downPercent = (downQuiz / sum) * 100;
    const upPercent = (upQuiz / sum) * 100;
    // console.log('다운', downPercent);
    // console.log('업', upPercent);

    return [downPercent, upPercent];
  }

  // 스케줄러
  async startUpdateQuiz(id: number) {
    const job = new CronJob(
      '0 */10 9-16 * * 1-5',
      () => {
        console.log('start');
        this.updateQuiz(id);
      },
      null,
      false,
      'Asia/Seoul',
    );
    await this.schedulerRegistry.addCronJob('updateQuiz', job);
    job.start();
  }
  async stopUpdateQuiz() {
    const job = await this.schedulerRegistry.getCronJob('updateQuiz');
    job.stop();
  }
}
