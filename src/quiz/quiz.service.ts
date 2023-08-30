import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizRepository } from './quiz.repository';
import { Users } from '../users/users.entity';
import { StockPrice } from '../stock/entities/stockPrice.entity';
import { Stock } from '../stock/entities/stock.entity';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { StockService } from 'src/stock/stock.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly stockService: StockService,
  ) {}

  async createQuiz(user: Users, data: CreateQuizDto) {
    await this.quizRepository.createQuiz(user, data);

    return {
      statusCode: 201,
      message: '퀴즈제출 성공',
    };
  }

  async updateQuiz(id: number, data: UpdateQuizDto): Promise<any> {
    const quizUser = await this.quizRepository.findOne({
      where: { id },
    });
    const searchStock = await this.stockService.searchStock(quizUser.stockName);
    // console.log('이름으로 찾기', searchStock[0].id);
    const searchStockNumber = await this.stockService.getStockPrice(
      searchStock[0].id,
    );
    // console.log('코드명으로 찾기', searchStockNumber);
    const stockAnswer = searchStockNumber.stockPrices[0].prdy_vrss_sign;
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

  //페이지네이션
  async paginate(page: number = 1): Promise<any> {
    const take = 2; //페이지 상에서 보일 개수(LIMIT)

    const [users, total] = await this.quizRepository.findAndCount({
      take,
      skip: (page - 1) * take, //skip이 OFFSET
    });

    return {
      data: users.map((user) => {
        // password, imgUrl을 제외한 data만 넘겨주기
        const { deletedAt, ...data } = user;

        return data;
      }),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}
