import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersSevice: UsersService,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  // POST. http://localhost:3000/users
  @Post()
  async signUp(@Body() body: SignUpDto) {
    return await this.usersSevice.signUp(body);
  }

  // POST. http://localhost:3000/users/login
  @Post('/login')
  logIn(@Body() body: LoginDto, @Res() res: Response) {
    return this.authService.jwtLogIn(body, res);
  }

  // GET. http://localhost:3000/users
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@CurrentUser() user: Users) {
    return user;
  }

  // POST. http://localhost:3000/users/check
  @UseGuards(JwtAuthGuard)
  @Post('/check')
  userCheck(@CurrentUser() user: Users, @Body() body: UserCheckDto) {
    return this.authService.userCheck(user.id, body);
  }

  // PATCH. http://localhost:3000/users
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateCurrentUser(
    @CurrentUser() user: Users,
    @Body() body: Partial<UpdateRequestDto>,
  ) {
    return await this.usersSevice.updateUser(user.id, body);
  }

  // DELETE. http://localhost:3000/users
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCurrentUser(@CurrentUser() user: Users) {
    return await this.usersSevice.deleteUser(user.id);
  }

  // 이메일 인증 해보는 중
  @Get()
  sendMail(): any {
    return this.emailService.example();
  }

  @Get('template')
  sendTemplate(): any {
    return this.emailService.example2();
  }
}
