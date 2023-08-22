import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { UserCheckDto } from './dto/user.check.dto';
import { Response } from 'express';
// import { KakaoLoginAuthDto } from './dto/kakao.dto';
import { Payload } from './jwt/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
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

  async validateOAuthLogin(
    thirdPartyId: string,
    email: string,
    nickname: string,
    provider: string,
  ): Promise<any> {
    // DB에서 사용자를 찾거나, 없는 경우 새로 생성하는 로직을 구현
    let user = await this.usersRepository.findUserByThirdPartyId(
      thirdPartyId,
      provider,
    );
    if (!user) {
      // 사용자가 없는 경우 새로 생성
      user = await this.usersRepository.createUserFromOAuth(
        thirdPartyId,
        email,
        nickname,
        provider,
      );
    }
    return user;
  }

  async generateJWT(user: any): Promise<string> {
    const payload: Payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
