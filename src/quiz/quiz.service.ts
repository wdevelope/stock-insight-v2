import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizRepository } from './quiz.repository';
import { Users } from '../users/users.entity';
import { StockService } from 'src/stock/stock.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly stockService: StockService,
  ) {}
  // 퀴즈 제출
  async createQuiz(user: Users, data: CreateQuizDto) {
    const id = user.id;
    const stockId = data.stockId;

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 9);
    const today = currentTime.toISOString().substring(0, 10).replace(/-/g, '');
    const updated_date = today;
    const todayTime = currentTime.toISOString().replace(/-/g, '');

    const time = Number(todayTime.substring(9, 11));
    const day = currentTime.getDay();

    const existQuiz = await this.quizRepository
      .createQueryBuilder('q')
      .select('q.stockId')
      .addSelect('q.updated_date')
      .innerJoin('q.user', 'user')
      .addSelect('user.id')
      .where('q.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .andWhere('q.stockId = :stockId', {
        stockId: stockId,
      })
      .andWhere('user.id = :id', {
        id: id,
      })
      .getRawMany();

    const existQuizNumber = await this.quizRepository
      .createQueryBuilder('q')
      .select('COUNT(*)', 'count')
      .innerJoin('q.user', 'user')
      .where('q.updated_date = :updated_date', {
        updated_date: updated_date,
      })
      .andWhere('user.id = :id', {
        id: id,
      })
      .getRawOne();

    const quizNumber = Number(existQuizNumber.count);

    // 제출 가능한 시간대 설정 (평일 9시부터 16시까지 제출 불가능)
    switch (day) {
      case 0:
      case 6:
        if (quizNumber > 9) {
          return {
            message: '오늘 제출 횟수를 초과하셨습니다.',
          };
        } else {
          if (existQuiz[0] === undefined) {
            await this.quizRepository.createQuiz(user, data);
            return {
              message: '퀴즈제출 성공',
            };
          } else {
            return { message: '이미 제출 하셨습니다' };
          }
        }

      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        if (8 < time && time < 16) {
          return {
            message: '제출 가능한 시간이 아닙니다.',
          };
        } else {
          if (quizNumber > 9) {
            return {
              message: '오늘 제출 횟수를 초과하셨습니다.',
            };
          } else {
            if (existQuiz[0] === undefined) {
              await this.quizRepository.createQuiz(user, data);
              return {
                message: '퀴즈제출 성공',
              };
            } else {
              return { message: '이미 제출 하셨습니다' };
            }
          }
        }
    }
  }

  // 퀴즈 확인 : correct가 null 인 값만 반환해서 다 확인
  async updateQuiz(): Promise<any> {
    const quizId = await this.quizRepository.find({ where: { correct: null } });

    for (const ele of quizId) {
      const id = ele.id;
      const quizUser = await this.quizRepository.findOne({
        where: { id },
      });
      const searchStock = await this.stockService.searchStock(quizUser.stockId);
      const searchStockNumber = await this.stockService.getStockPrice(
        searchStock.data[0].id,
      );
      const stockAnswer = searchStockNumber.stock.stockPrices[0].prdy_vrss_sign;
      let upANDdownAnswer: string;
      if (stockAnswer === '1') {
        upANDdownAnswer = 'up';
      } else if (stockAnswer === '2') {
        upANDdownAnswer = 'up';
      } else if (stockAnswer === '3') {
        upANDdownAnswer = 'keep';
      } else if (stockAnswer === '4') {
        upANDdownAnswer = 'down';
      } else if (stockAnswer === '5') {
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

  // stockId에 맞는 up 비율 (전체)
  async upQuiz(stockId: string) {
    const upQ = await this.quizRepository.upQuiz(stockId);
    const downQ = await this.quizRepository.downQuiz(stockId);
    const sumQ = Number(upQ.count) + Number(downQ.count);
    const upPercent = (Number(upQ.count) / sumQ) * 100;

    return Math.round(upPercent);
  }

  // stockId에 맞는 down 비율 (전체)
  async downQuiz(stockId: string) {
    const upQ = await this.quizRepository.upQuiz(stockId);
    const downQ = await this.quizRepository.downQuiz(stockId);
    const sumQ = Number(upQ.count) + Number(downQ.count);
    const downPercent = (Number(downQ.count) / sumQ) * 100;

    return Math.round(downPercent);
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

  // 쿼리빌더 이용한 페이지네이션 구현 (주식명 추가)
  async getUserQuiz(userId: number, page: number = 1) {
    const queryBuilder = await this.quizRepository
      .createQueryBuilder('q')
      .orderBy('q.updated_date', 'DESC')
      .innerJoin('q.stock', 'stock')
      .addSelect('stock.prdt_abrv_name');
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

  // user.id에 맞는 맞춘 비율
  async correctQuiz(userId: number) {
    const correctTrue = await this.quizRepository.correctQuizTrue(userId);
    const correctFalse = await this.quizRepository.correctQuizFalse(userId);
    const sumCorrect =
      Number(correctTrue[0].count) + Number(correctFalse[0].count);
    const quizPercent = (Number(correctTrue[0].count) / sumCorrect) * 100;

    return Math.round(quizPercent);
  }
}
