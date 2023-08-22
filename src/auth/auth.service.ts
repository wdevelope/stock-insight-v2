import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { UserCheckDto } from './dto/user.check.dto';
import { Response } from 'express';
import { KakaoLoginAuthDto } from './dto/kakao.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogIn(data: LoginDto, res: Response) {
    const { email, password } = data;

    const user = await this.usersRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('email 또는 password를 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('email 또는 password를 확인해주세요.');
    }

    const payload = { id: user.id, email: email };
    const token = this.jwtService.sign(payload);

    return res.send({
      token: token,
    });
  }

  async userCheck(id: number, data: UserCheckDto) {
    const { password } = data;

    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException('email 또는 password를 확인해주세요.');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('email 또는 password를 확인해주세요.');
    }

    return {
      message: '사용자 확인 완료',
    };
  }

  async OAuthLogin(data: KakaoLoginAuthDto, res: Response) {
    // 1. 회원조회
    const { email } = data;
    let user = await this.usersRepository.findUserByEmail(email); //user를 찾아서

    // 2, 회원가입이 안되어있다면?
    if (!user) user = await this.usersRepository.createKakao({ email });

    // 3. 회원가입이 되어있다면? 로그인(AT, RT를 생성해서 브라우저에 전송)한다
    const payload = { id: user.id, email: email };
    const token = this.jwtService.sign(payload);

    return res.send({
      token: token,
    });
  }
}
