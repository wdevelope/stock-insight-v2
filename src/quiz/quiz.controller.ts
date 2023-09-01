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
import { Stock } from 'src/stock/entities/stock.entity';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}
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
  @Patch('/answer/:id')
  async updateQuiz(@Param('id') id: number, @Body() data: UpdateQuizDto) {
    return await this.quizService.updateQuiz(id, data);
  }
}
