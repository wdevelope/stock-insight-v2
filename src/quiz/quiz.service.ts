import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizRepository } from './quiz.repository';
import { Users } from '../users/users.entity';
import { UsersRepository } from 'src/users/users.repository';
import { Stock } from 'src/stock/entities/stock.entity';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createQuiz(user: Users, data: CreateQuizDto) {
    // const { upANDdown, stockName } = body;
    // const quizUser = await this.usersRepository.findOne({ where: { id } });
    // console.log(quizUser);
    return await this.quizRepository.createQuiz(user, data);

    // return {
    //   statusCode: 201,
    //   message: '퀴즈제출 성공',
    // };
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
