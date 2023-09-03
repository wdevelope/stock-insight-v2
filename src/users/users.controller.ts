import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from './users.entity';
import { UserCheckDto } from 'src/auth/dto/user.check.dto';
import { SignUpDto } from './dto/signUp.dto';
import { Response } from 'express';
import { UpdateRequestDto } from './dto/updateRequest.dto';
import { EmailService } from './email/email.service';
import { EmailDto } from './dto/email.dto';
import { PointDto } from './dto/point.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  // POST. http://localhost:3000/api/users
  @Post()
  @ApiOperation({
    summary: '회원가입 API.',
    description: '회원가입을 한다.',
  })
  @ApiBody({ type: [SignUpDto] })
  async signUp(@Body(ValidationPipe) body: SignUpDto) {
    return await this.usersService.signUp(body);
  }

  // POST. http://localhost:3000/api/users/login
  @Post('/login')
  @ApiOperation({
    summary: '로그인 API.',
    description: '로그인을 한다.',
  })
  @ApiBody({ type: [LoginDto] })
  logIn(@Body() body: LoginDto, @Res() res: Response) {
    return this.authService.jwtLogIn(body, res);
  }

  // GET. http://localhost:3000/api/users
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user: Users) {
    const {
      board,
      askboard,
      noticeboard,
      views,
      likes,
      comment,
      quiz,
      myStocks,
      ...rest
    } = user;
    return rest;
  }

  // POST. http://localhost:3000/api/users/check
  @UseGuards(JwtAuthGuard)
  @Post('/check')
  userCheck(@CurrentUser() user: Users, @Body() body: UserCheckDto) {
    return this.authService.userCheck(user.id, body);
  }

  // PATCH. http://localhost:3000/api/users/:id
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '유저 정보 수정API',
    description: '유저 정보를 수정한다.',
  })
  @ApiBody({ type: [UpdateRequestDto] })
  @Patch('/:id')
  async updateCurrentUser(
    @Param('id') id: number,
    @CurrentUser() user: Users,
    @Body() body: Partial<UpdateRequestDto>,
  ) {
    return await this.usersService.updateUser(id, body);
  }

  // DELETE. http://localhost:3000/api/users/:id
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '유저 삭제 API',
    description: '유저 정보를 삭제한다.',
  })
  @Delete('/:id')
  async deleteCurrentUser(@Param('id') id: number, @CurrentUser() user: Users) {
    return await this.usersService.deleteUser(id);
  }

  // 이메일 보내는것 까지 성공 http://localhost:3000/api/users/email
  @Post('/email')
  @ApiOperation({
    summary: '이메일 인증 API',
  })
  sendTemplate(@Body() body: EmailDto): any {
    return this.emailService.authEmail(body);
  }

  // 이메일 인증 http://localhost:3000/api/users/verifyEmail
  @ApiOperation({
    summary: '이메일 인증 API',
  })
  @Post('/verifyEmail')
  async verifyEmail(@Body() body) {
    return this.emailService.verifyEmail(body.email, body.randomCode);
  }

  // 유저 퀴즈 http://localhost:3000/api/users/quiz/:id
  @ApiOperation({
    summary: '퀴즈 API',
  })
  @ApiBody({ type: [PointDto] })
  @Patch('/quiz/:id')
  async userPoint(
    @Param('id') id: number,
    @CurrentUser() user: Users,
    @Body() body: PointDto,
  ) {
    return await this.usersService.updatePoint(id, body);
  }

  // 유저 스텟 변동 http://localhost:3000/api/users/status/:id
  @ApiOperation({ summary: '유저 스테이터스 변경 API' })
  @Patch('/status/:id')
  async userStatus(@Param('id') id: number, @CurrentUser() user: Users) {
    return await this.usersService.updateUserStatus(id);
  }

  //페이지네이션 http://localhost:3000/api/users/page(?page=1)쿼리부분
  @Get('/page')
  async all(@Query('page') page: number = 1): Promise<Users[]> {
    return await this.usersService.paginate(page);
  }
}
