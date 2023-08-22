import { Body, Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { KakaoLoginAuthDto } from './dto/kakao.dto';

@Controller('kakao')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/login')
  @UseGuards(AuthGuard('kakao')) //인증과정을 거쳐야하기때문에 UseGuards를 써주고 passport인증으로 AuthGuard를 써준다. 이름은 kakao로
  async loginKakao(
    @Body() body: KakaoLoginAuthDto,
    @Res() res: Response, //Nest.js가 express를 기반으로 하기때문에 Request는 express에서 import한다.
  ) {
    //프로필을 받아온 다음, 로그인 처리해야하는 곳(auth.service.ts에서 선언해준다)
    return this.authService.OAuthLogin(body, res);
  }
}
