import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

@ApiTags('kakao')
@Controller('api/kakao')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '카카오 로그인 API.',
    description: '카카오로 로그인을 한다..',
  })
  @Get('/login')
  @UseGuards(KakaoAuthGuard)
  async loginKakao() {}

  @ApiOperation({
    summary: '카카오 로그인 API.',
    description: '카카오로 로그인을 한다..',
  })
  @Get('/login/callback')
  @UseGuards(KakaoAuthGuard)
  async callback(@Req() req, @Res() res) {
    const user = req.user;
    const token = await this.authService.generateJWT(user);
    res.cookie('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: true, // HTTPS 사용 시 활성화
      // maxAge: 1000 * 60 * 60 * 24 * 7, // 쿠키 유효 기간 설정 (예: 1주일)
    });
    return res.redirect(`https://stockinsight.site/index`);
  }
}
