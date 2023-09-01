import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // up down 페이지네이션
  @Get()
  async findNumberByupANDdown(
    @Query('upANDdown') upANDdown: string,
    @Query('page') page: number = 1,
  ) {
    return await this.quizService.findNumberByupANDdown(upANDdown, page);
  }

  // 퀴즈 제출
  @ApiOperation({ summary: '퀴즈 제출 API', description: '퀴즈 제출을 한다.' })
  @ApiBody({ type: CreateQuizDto })
  @Post('/submit')
  @UseGuards(JwtAuthGuard)
  async createQuiz(@CurrentUser() user: Users, @Body() data: CreateQuizDto) {
    return await this.quizService.createQuiz(user, data);
  }

  // 퀴즈 확인
  @ApiOperation({ summary: '퀴즈 확인 API', description: '퀴즈 확인을 한다.' })
  @ApiBody({ type: UpdateQuizDto })
  @Patch('/answer')
  async updateQuiz() {
    return await this.quizService.updateQuiz();
  }

  // up, down 각각의 개수의 합
  @Get('/sum')
  async getQuiz() {
    return await this.quizService.getQuiz();
  }

  // up, down 비율
  @Get('/percent')
  async getPercent() {
    return await this.quizService.getPercentQuiz();
  }

  //퀴즈 확인 스케줄러 시작
  @Post('/updatequizstart')
  startUpdateQuiz(): string {
    this.quizService.startUpdateQuiz();
    return '스케쥴 시작!';
  }

  //퀴즈 확인 스케줄러 종료
  @Post('/updatequizstop')
  stopUpdateQuiz(): string {
    this.quizService.stopUpdateQuiz();
    return '스케쥴 종료!';
  }
}
