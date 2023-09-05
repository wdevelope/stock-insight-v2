import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
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

  // 퀴즈 제출 http://localhost:3000/quiz/submit
  @ApiOperation({ summary: '퀴즈 제출 API', description: '퀴즈 제출을 한다.' })
  @ApiBody({ type: CreateQuizDto })
  @Post('/submit')
  @UseGuards(JwtAuthGuard)
  async createQuiz(@CurrentUser() user: Users, @Body() data: CreateQuizDto) {
    return await this.quizService.createQuiz(user, data);
  }

  // 퀴즈 확인 http://localhost:3000/quiz/answer
  @ApiOperation({ summary: '퀴즈 확인 API', description: '퀴즈 확인을 한다.' })
  @ApiBody({ type: UpdateQuizDto })
  @Patch('/answer')
  async updateQuiz() {
    return await this.quizService.updateQuiz();
  }

  // up 비율 http://localhost:3000/quiz/up
  @Get('/up')
  async upQuiz() {
    return await this.quizService.upQuiz();
  }

  // down 비율 http://localhost:3000/quiz/down
  @Get('/down')
  async downQuiz() {
    return await this.quizService.downQuiz();
  }

  // 퀴즈 확인 스케줄러 시작 http://localhost:3000/quiz/updatequizstart
  @Post('/updatequizstart')
  startUpdateQuiz(): string {
    this.quizService.startUpdateQuiz();
    return '스케쥴 시작!';
  }

  // 퀴즈 확인 스케줄러 종료 http://localhost:3000/quiz/updatequizstop
  @Post('/updatequizstop')
  stopUpdateQuiz(): string {
    this.quizService.stopUpdateQuiz();
    return '스케쥴 종료!';
  }

  // stockId에 맞는 up 비율 http://localhost:3000/quiz/up/:id
  @Get('/up/:id')
  async upStockQuiz(@Param('id') stockId: string) {
    return await this.quizService.upStockQuiz(stockId);
  }

  // stockId에 맞는 down 비율 http://localhost:3000/quiz/down/:id
  @Get('/down/:id')
  async downStockQuiz(@Param('id') stockId: string) {
    return await this.quizService.downStockQuiz(stockId);
  }
}
