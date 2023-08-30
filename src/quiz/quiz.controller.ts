import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { Users } from 'src/users/users.entity';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
  // 퀴즈 제출
  @Post('/answer')
  @UseGuards(JwtAuthGuard)
  async createQuiz(@CurrentUser() user: Users, @Body() data: CreateQuizDto) {
    return await this.quizService.createQuiz(user, data);
  }
}
